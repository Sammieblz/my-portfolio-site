import { json } from '@sveltejs/kit';

// Store device state in memory (in production, you might want to use a database)
let deviceState = {
    battery: 85,
    charging: false,
    lastUpdate: Date.now()
};

export async function GET() {
    try {
        // Simulate realistic battery drain/charge
        const now = Date.now();
        const timeDiff = now - deviceState.lastUpdate;
        const minutesPassed = timeDiff / (1000 * 60); // Convert to minutes
        
        // Simulate battery drain (0.1% per minute when not charging)
        if (!deviceState.charging) {
            deviceState.battery = Math.max(0, deviceState.battery - (minutesPassed * 0.1));
            
            // Auto-start charging when battery is low
            if (deviceState.battery <= 20) {
                deviceState.charging = true;
            }
        } else {
            // Simulate charging (0.5% per minute when charging)
            deviceState.battery = Math.min(100, deviceState.battery + (minutesPassed * 0.5));
            
            // Stop charging when battery is full
            if (deviceState.battery >= 100) {
                deviceState.charging = false;
            }
        }
        
        deviceState.lastUpdate = now;
        
        // Simulate network connection based on battery level
        let wifiLevel = 100;
        let connectionType = 'wifi';
        
        if (deviceState.battery < 10) {
            wifiLevel = 25;
            connectionType = 'slow-2g';
        } else if (deviceState.battery < 30) {
            wifiLevel = 50;
            connectionType = '2g';
        } else if (deviceState.battery < 60) {
            wifiLevel = 75;
            connectionType = '3g';
        } else {
            wifiLevel = 100;
            connectionType = '4g';
        }
        
        return json({
            battery: Math.round(deviceState.battery),
            charging: deviceState.charging,
            wifi: wifiLevel,
            connectionType: connectionType,
            online: true,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Device API error:', error);
        return json({ error: 'Failed to get device info' }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const { action, value } = await request.json();
        
        if (action === 'setCharging') {
            deviceState.charging = value;
            deviceState.lastUpdate = Date.now();
        } else if (action === 'setBattery') {
            deviceState.battery = Math.max(0, Math.min(100, value));
            deviceState.lastUpdate = Date.now();
        }
        
        return json({ success: true, battery: deviceState.battery, charging: deviceState.charging });

    } catch (error) {
        console.error('Device API POST error:', error);
        return json({ error: 'Failed to update device state' }, { status: 500 });
    }
}
