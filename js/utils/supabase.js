// Supabase Configuration
// Database untuk menyimpan data jadwal yang bisa diakses semua user

const SUPABASE_CONFIG = {
    url: 'https://kpkhoybufnwptomzyide.supabase.co',
    anonKey: 'sb_publishable_qY-ya3uUBMe84napglvcvA_sj9oNrHu'
};

// Supabase Client (menggunakan REST API langsung tanpa SDK)
const SupabaseClient = {
    baseUrl: SUPABASE_CONFIG.url,
    headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    },

    // GET request
    async get(table, params = '') {
        try {
            const url = `${this.baseUrl}/rest/v1/${table}${params ? '?' + params : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[Supabase] GET ${table} error:`, error);
            return null;
        }
    },

    // POST request (insert)
    async insert(table, data) {
        try {
            const url = `${this.baseUrl}/rest/v1/${table}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[Supabase] INSERT ${table} error:`, error);
            return null;
        }
    },

    // PATCH request (update)
    async update(table, id, data) {
        try {
            const url = `${this.baseUrl}/rest/v1/${table}?id=eq.${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorBody}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[Supabase] UPDATE ${table} error:`, error);
            return null;
        }
    },

    // DELETE request
    async delete(table, id) {
        try {
            const url = `${this.baseUrl}/rest/v1/${table}?id=eq.${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.headers
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorBody}`);
            }

            return true;
        } catch (error) {
            console.error(`[Supabase] DELETE ${table} error:`, error);
            return false;
        }
    }
};

console.log('[Supabase] Client initialized');
