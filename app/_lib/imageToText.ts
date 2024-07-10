export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TextElement {
  text: string;
  bounding_box: BoundingBox;
}

export async function imageToText(imageFile: File, apiKey: string) {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch("https://api.api-ninjas.com/v1/imagetotext", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
