import AddProperty from "./AddProperty";
import GetMyProperties from "./GetMyProperties";

const ManageProperty = () => {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="sm:col-span-1">
                <AddProperty></AddProperty>
            </div>
            <div className="sm:col-span-2">
                <GetMyProperties></GetMyProperties>
            </div>
        </div>
    );
};

export default ManageProperty;
