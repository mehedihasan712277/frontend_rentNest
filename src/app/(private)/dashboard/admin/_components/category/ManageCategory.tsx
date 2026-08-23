import { CreateCategoryForm } from "./CreateCategoryForm";
import GetCategory from "./GetCategory";

const ManageCategory = () => {
    return (
        <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
                <CreateCategoryForm></CreateCategoryForm>
            </div>
            <div className="sm:col-span-2">
                <GetCategory></GetCategory>
            </div>
        </div>
    );
};

export default ManageCategory;
