import { CreateCategoryForm } from "./CreateCategoryForm";
import GetCategory from "./GetCategory";

const ManageCategory = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
                <CreateCategoryForm></CreateCategoryForm>
            </div>
            <div className="col-span-2">
                <GetCategory></GetCategory>
            </div>
        </div>
    );
};

export default ManageCategory;
