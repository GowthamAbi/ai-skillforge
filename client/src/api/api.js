const BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export async function api(
  path,
  options = {}
) {
  const url = `${BASE}${path}`;

  try {
    const response = await fetch(
      url,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers || {}),
        },
      }
    );

    let data;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
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