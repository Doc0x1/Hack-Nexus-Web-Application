import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters'),
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters')
});

// Create transporter for Mailtrap
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT || '2525'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate input using Zod
        const validatedData = registerSchema.parse(body);
        const { email, password, username, name } = validatedData;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email.toLowerCase() }, 
                    { username: username.toLowerCase() }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
            }
            if (existingUser.username === username.toLowerCase()) {
                return NextResponse.json({ error: 'This username is already taken' }, { status: 409 });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                username: username.toLowerCase(),
                name: name || null,
                role: 'MEMBER',
                isActive: false, // User needs to verify email first
                emailVerified: null
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        // Create verification token
        await prisma.verificationToken.create({
            data: {
                identifier: user.email!,
                token: verificationToken,
                expires: verificationExpires
            }
        });

        // Send verification email
        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: process.env.MAILTRAP_FROM || 'noreply@hacknexus.io',
            to: user.email!,
            subject: 'Verify your email address - HackNexus.io',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Hack Nexus!</h2>
                    <p>Hi ${user.name || user.username},</p>
                    <p>Thank you for registering with HackNexus.io Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account with HackNexus.io, you can safely ignore this email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #666; font-size: 12px;">
                        This email was sent from HackNexus.io. Please do not reply to this email.
                    </p>
                </div>
            `
        } satisfies nodemailer.SendMailOptions;

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            {
                message: 'Registration successful. Please check your email to verify your account.',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    name: user.name
                }
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.errors
            }, { status: 400 });
        }
        
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
