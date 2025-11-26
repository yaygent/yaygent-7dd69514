/**
 * Shared in-memory image store
 * In production, replace this with a database
 */
export interface Image {
  id: string;
  filename: string;
  url: string;
  size: number;
  width: number;
  height: number;
  uploadedAt: string;
}

const images: Image[] = [];

export const imageStore = {
  getAll(): Image[] {
    return images;
  },

  getById(id: string): Image | undefined {
    return images.find((img) => img.id === id);
  },

  add(image: Image): void {
    images.push(image);
  },

  remove(id: string): boolean {
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) {
      return false;
    }
    images.splice(index, 1);
    return true;
  },

  getCount(): number {
    return images.length;
  },
};
