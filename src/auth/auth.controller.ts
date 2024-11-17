// src/auth/auth.controller.ts

import { Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    // Render the login page
    @Get('login')
    @Render('login')
    showLoginPage() {
        return { layout: false };  // Returns an empty object, used just to render the login template
    }

    // Handle login form submission
    @Post('login')
    @UseGuards(AuthGuard('local'))
    validateUser(@Req() req: Request, @Res() res: Response) {
        console.log('User logged in:', req.user); // Check if the user is set
        // console.log('Session:', req.session);
        return res.redirect('/admin/blogs');  // Redirect to admin panel after successful login
    }

    // Handle logout
    @Get('logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.logout(err => {
            if (err) return console.error(err);
            res.redirect('/auth/login');
        });
    }
}
