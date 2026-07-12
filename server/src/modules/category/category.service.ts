import { Category } from './category.model';
import { ApiError } from '../../utils/ApiError';

export async function listCategories() {
  return Category.find().sort({ name: 1 });
}

export async function createCategory(data: { name: string; icon?: string; description?: string }) {
  const existing = await Category.findOne({ name: new RegExp(`^${data.name}$`, 'i') });
  if (existing) throw ApiError.conflict('A category with this name already exists');
  return Category.create(data);
}

export async function updateCategory(id: string, updates: Partial<{ name: string; icon: string; description: string }>) {
  const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!category) throw ApiError.notFound('Category not found');
  return category;
}

export async function deleteCategory(id: string) {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound('Category not found');
  if (category.propertyCount > 0) {
    throw ApiError.badRequest('Cannot delete a category that still has properties assigned to it');
  }
  await category.deleteOne();
}
