import { json } from '@sveltejs/kit';

export async function GET({ request }) {
    try {
        // Get system information from request headers and user agent
        const userAgent = request.headers.get('user-agent') || '';
        const acceptLanguage = request.headers.get('accept-language') || '';
        
        // Parse system information from user agent
        const systemInfo = parseSystemInfo(userAgent);
        
        return json({
            platform: systemInfo.platform,
            browser: systemInfo.browser,
            os: systemInfo.os,
            language: acceptLanguage.split(',')[0] || 'en-US',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('System info API error:', error);
        return json({ error: 'Failed to get system info' }, { status: 500 });
    }
}

function parseSystemInfo(userAgent) {
    const ua = userAgent.toLowerCase();
    
    // Detect OS
    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios')) os = 'iOS';
    
    // Detect Browser
    let browser = 'Unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    
    // Detect Platform
    let platform = 'Unknown';
    if (ua.includes('mobile')) platform = 'Mobile';
    else if (ua.includes('tablet')) platform = 'Tablet';
    else platform = 'Desktop';
    
    return { os, browser, platform };
}
