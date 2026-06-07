export async function apiRequest(requestFuc) {
  try {
    const response = await requestFuc();
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data?.detail || error.message,
    };
  }
}
