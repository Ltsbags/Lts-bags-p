import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const enquiries = db.getEnquiries();
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, mobile, productRequirement, message, quantity, productId } = body;

    if (!name || !email || !mobile || !productRequirement || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (Name, Email, Mobile, Product Requirement, Message)' },
        { status: 400 }
      );
    }

    const newEnquiry = db.createEnquiry({
      name,
      company: company || 'Not Specified',
      email,
      mobile,
      productRequirement,
      productId: productId || undefined,
      quantity: quantity ? Number(quantity) : 100,
      message,
    });

    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully. Our sales team will contact you within 24 hours.', enquiry: newEnquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
