const LEGACY_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://ai-skillforge.onrender.com/api" : "http://localhost:5000/api");
// All roadmap and code-runner endpoints are mounted on the main SkillForge API.
const PATH_BASE = LEGACY_BASE;
export async function api(path, options = {}) {
  const { pathApi = false, ...requestOptions } = options;
  const base = pathApi || path.startsWith('/path/') ? PATH_BASE : LEGACY_BASE;
  const url = `${base}${path}`;
  try {
    const response = await fetch(url, {
      ...requestOptions,
      headers: {
        "Content-Type": "application/json",
        ...(requestOptions.headers || {
        }),
      },
    });
    let data = null;
    try {
      data = await response.json();
    } catch {
      // No JSON response
    }
    if (!response.ok) {
      throw new Error(
        (data?.pending?.length ? data.pending.join(' · ') : data?.error) ||
          `Request failed (${response.status})`
      );
    }
    return data;
  } catch (error) {
    console.error(
      `API request failed: ${url}`,
      error
    );
    throw error;
  }
}
