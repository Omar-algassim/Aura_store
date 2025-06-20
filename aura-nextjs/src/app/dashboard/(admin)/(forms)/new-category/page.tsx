import React from "react";
import Input from "@/components/ui/dashboard/form/input/InputField";
import Label from "@/components/ui/dashboard/form/Label";
import Button from "@/components/ui/dashboard/ui/button/Button";
import cookie from "js-cookie";
import {
  newCategoryAction,
  updateCategory,
  createCategory,
} from "@/utils/services/dashboard/category";
import { getFieldError } from "@/components/ui/forms/handleError";
import { useToast } from "@/hooks/use-toast";

interface categoryProps {
  editMode?: boolean;
  category?: {
    id: string;
    documentId: string;
    title: string;
    priority: number;
  };
  toggleEditModal?: () => void;
}

export default function CategoryForm(props: categoryProps) {
  const { editMode, category } = props;
  const [state, action, isPending] = React.useActionState(handleSave, null);
  const { toast } = useToast();

  const titleError = getFieldError(state?.error, "title");
  const priorityError = getFieldError(state?.error, "priority");

  async function handleSave(
    prev: any,
    formData: FormData
  ): Promise<{
    message: string;
    type?: string;
    data: any | null;
    error?: any;
  }> {
    const jwt = cookie.get("jwt");
    if (!jwt) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "Please log in to continue.",
      });
      return {
        message: "You must be logged in to perform this action.",
        type: "error",
        data: null,
        error: "Unauthorized",
      };
    }
    const validation = newCategoryAction(prev, formData);
    if (validation.error) {
      return {
        message: "Validation error",
        type: "validation",
        data: null,
        error: validation.error,
      };
    }
    const data = {
      title: validation.data.title,
      priority: validation.data.priority,
    };
    if (editMode && category) {
      const { error, data: updatedData } = await updateCategory(
        category.documentId,
        jwt,
        data
      );
      if (error) {
        props.toggleEditModal?.();
        toast({
          variant: "destructive",
          title: "Error updating category",
          description: error || "Failed to update category.",
      });
        return {
          message: "Error updating category",
          type: "error",
          data: null,
          error: error,
        };
      }
      props.toggleEditModal?.();
      toast({
        variant: "success",
        title: "Category updated",
        description: "Category has been updated successfully.",
      });
      window.location.reload();
      return {
        message: "Category updated successfully",
        type: "success",
        data: updatedData,
        error: null,
      };
    }
    const { error, data: newData } = await createCategory(jwt, data);
    if (error) {
      props.toggleEditModal?.();
      toast({
        variant: "destructive",
        title: "Error creating category",
        description: error || "Failed to create category.",
      });
      return {
        message: "Error creating category",
        type: "error",
        data: null,
        error: error,
      };
    }
    props.toggleEditModal?.();
    toast({
      variant: "success",
      title: "Category created",
      description: "Category has been created successfully.",
    });
    window.location.reload();
    return {
      message: "Category created successfully",
      type: "success",
      data: newData,
      error: null,
    };
  }

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Fill category Information
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {editMode
            ? `edit ${category?.title}`
            : " register new category in store."}
        </p>
      </div>
      <form action={action} className="flex flex-col">
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
          <div>
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Main information
            </h5>
            <div>
              <Label>Title *</Label>
              <Input
                name="title"
                defaultValue={category?.title}
                placeholder="the name of product"
                type="text"
              />
              {titleError.length > 0 ? (
                titleError.map((error, index) => (
                  <span
                    key={index}
                    className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
                  >
                    {error.message}
                  </span>
                ))
              ) : (
                <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
              )}
            </div>
            <div>
              <Label>Priority *</Label>
              <Input
                name="priority"
                defaultValue={category?.priority}
                placeholder="Number represent the sort of category in the list"
                type="number"
              />
              {priorityError.length > 0 ? (
                priorityError.map((error, index) => (
                  <span
                    key={index}
                    className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] "
                  >
                    {error.message}
                  </span>
                ))
              ) : (
                <span className="flex-1 text-primary-dark text-xs text-right font-[400] font-alex max-w-[200px] h-8 text-wrap"></span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm">{editMode ? "Save Changes" : "Submit"}</Button>
        </div>
      </form>
    </div>
  );
}
