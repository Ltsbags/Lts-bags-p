import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, messages, lead } = body;

    // Action 1: Submit a chatbot lead/enquiry directly
    if (action === 'submit_lead') {
      if (!lead || !lead.name || (!lead.email && !lead.mobile)) {
        return NextResponse.json(
          { error: 'Customer Name and Email or Mobile Number are required.' },
          { status: 400 }
        );
      }

      const newEnquiry = db.createEnquiry({
        name: lead.name.trim(),
        company: lead.company ? lead.company.trim() : 'N/A',
        email: lead.email ? lead.email.trim() : 'N/A',
        mobile: lead.mobile ? lead.mobile.trim() : 'N/A',
        productRequirement: lead.productRequirement ? lead.productRequirement.trim() : 'General Bag Inquiry',
        quantity: Number(lead.quantity) || 100,
        message: lead.message ? lead.message.trim() : 'Submitted via LTS BAGS AI Chatbot',
        source: 'AI_CHATBOT',
      });

      return NextResponse.json({
        success: true,
        message: 'Lead saved successfully',
        enquiryId: newEnquiry.id,
      });
    }

    // Action 2: Chat message processing
    const userMessages = Array.isArray(messages) ? messages : [];
    if (userMessages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Fetch Database Knowledge Context
    const products = db.getProducts();
    const categories = db.getCategories();
    const settings = db.getSettings();
    const contact = settings?.contactInfo || {
      companyName: 'LTS BAGS PRIVATE LIMITED',
      tagline: 'Premier OEM/ODM Custom Bag Manufacturer & Global Exporter',
      phone1: '+91 98335 98338',
      phone2: '+91 96199 61971',
      email1: 'info@ltsbags.com',
      email2: 'sales@ltsbags.com',
      factoryAddress: 'MIDC Industrial Area, Navi Mumbai, Maharashtra, India',
      workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
      gstNumber: '27AABCL9876Q1Z5',
      isoCertificate: 'ISO 9001:2015 Certified',
      socialWhatsapp: '+91 98335 98338',
    };
    const about = settings?.about || {
      headline: 'India’s Leading Wholesale B2B Custom Bag Factory',
      storyContent: 'With over two decades of manufacturing craftsmanship...',
      missionTitle: 'Quality & Speed',
      missionContent: 'Deliver high tensile durable bags at direct factory rates.',
    };

    // Format Database Products Context
    const productsContext = products.map((p, idx) => {
      const specsStr = (p.specifications || []).map(s => `${s.label}: ${s.value}`).join(', ');
      const featuresStr = (p.features || []).join(', ');
      return `[Product #${idx + 1}]
Name: ${p.name}
Category: ${p.categoryName || 'General'}
MOQ (Minimum Order Quantity): ${p.moq} units
Materials: ${p.materials || 'High-grade polyester/nylon'}
Features: ${featuresStr}
Specifications: ${specsStr}
Short Description: ${p.shortDesc || ''}
Full Description: ${p.fullDesc || ''}
Custom Branding: Logo embroidery, screen printing, rubber badges, laser-etched metal plates available.
`;
    }).join('\n');

    const categoriesContext = categories.map(c => `- ${c.name}: ${c.description}`).join('\n');

    const systemInstruction = `You are the official B2B AI Support Specialist for "LTS BAGS PRIVATE LIMITED".
Your mission is to help B2B buyers, procurement managers, corporate gifting leads, and exporters find information about custom bag manufacturing, products, specifications, MOQs, materials, custom branding, and bulk quotation requests.

CRITICAL KNOWLEDGE BASE BOUNDARIES (STRICT ACCURACY RULES):
1. Use the provided DATABASE CONTEXT below as your absolute single source of truth.
2. DO NOT invent or make up product specifications, prices, MOQs, material compositions, lead times, or company addresses that are not in the database context.
3. If a user asks for information (e.g. specific custom pricing, unlisted product specs, or non-existent bag models) that is NOT available in the database context, clearly state that the specific information is currently unavailable in our catalog, and politely offer to help them submit a quotation enquiry to our sales engineering team.
4. Always maintain a professional, helpful, responsive, B2B-tailored tone. Keep responses readable with concise bullet points where appropriate.

DATABASE CONTEXT:

=== COMPANY DETAILS & CONTACT INFO ===
Company Name: ${contact.companyName || 'LTS BAGS PRIVATE LIMITED'}
Tagline: ${contact.tagline || 'Premier OEM/ODM Custom Bag Manufacturer & Global Exporter'}
Primary Phone: ${contact.phone1 || '+91 98335 98338'}
Secondary Phone: ${contact.phone2 || '+91 96199 61971'}
Sales Email: ${contact.email2 || contact.email1 || 'sales@ltsbags.com'}
Factory Address: ${contact.factoryAddress || 'MIDC Industrial Area, Navi Mumbai, Maharashtra, India'}
Working Hours: ${contact.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'}
Certifications: GST: ${contact.gstNumber || '27AABCL9876Q1Z5'} | ${contact.isoCertificate || 'ISO 9001:2015 Certified'}
WhatsApp Support: ${contact.socialWhatsapp || contact.phone1 || '+91 98335 98338'}

=== PRODUCT CATEGORIES (${categories.length} Categories) ===
${categoriesContext}

=== PRODUCT CATALOG (${products.length} Products) ===
${productsContext}

=== FACTORY & MANUFACTURING CAPACITY ===
Headline: ${about.headline}
Story & Heritage: ${about.storyContent}
Mission: ${about.missionContent}
Daily Production Capacity: 10,000+ units per day
Production Workflow: 1. Requirement & CAD Brief -> 2. Physical Sample in 3-5 Days -> 3. Bulk CNC Cutting & Automated Stitching -> 4. 100% QC Inspection & Express Global Shipping.
Export Enquiries: Full export documentation, door-to-door freight, containerized shipping handled worldwide.

=== LEAD GENERATION INSTRUCTION ===
Whenever the user asks for a price quote, wants to order in bulk, requests a physical sample, or asks how to contact sales:
Inform them:
"You can request an instant quote right here in this chat by clicking the 'Request Quote' button, or provide your Name, Company Name, Mobile Number, Email, Bag Type, and Quantity!"`;

    // Format chat history for Gemini
    const lastUserMessage = userMessages[userMessages.length - 1];
    const promptText = typeof lastUserMessage === 'string' 
      ? lastUserMessage 
      : lastUserMessage.content || lastUserMessage.text || '';

    // History formatting
    let conversationHistory = '';
    if (userMessages.length > 1) {
      conversationHistory = userMessages.slice(0, -1).map((m: { role?: string; content?: string; text?: string }) => {
        const sender = m.role === 'user' ? 'Customer' : 'AI Assistant';
        const txt = m.content || m.text || '';
        return `${sender}: ${txt}`;
      }).join('\n');
    }

    const fullPrompt = conversationHistory 
      ? `Previous Conversation History:\n${conversationHistory}\n\nCurrent Customer Question: ${promptText}`
      : promptText;

    // Use Gemini API
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not configured
      return NextResponse.json({
        reply: `Thank you for contacting LTS BAGS PRIVATE LIMITED support! Our factory specializes in high-volume OEM/ODM bag manufacturing. For direct inquiries, call us at ${contact.phone1} or click "Request Quote" to leave your specifications.`,
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      },
    });

    const replyText = response.text || "I am here to help you with LTS BAGS products and bulk quotations. How may I assist your business today?";

    return NextResponse.json({ reply: replyText });
  } catch (err: unknown) {
    console.error('Error in chatbot API route:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to process chat message';
    return NextResponse.json(
      { 
        reply: "I am having trouble accessing the live server right now. You can call our direct sales team at +91 98335 98338 or click 'Request Quote' below to send us your requirements!",
        error: errorMessage
      },
      { status: 200 }
    );
  }
}
