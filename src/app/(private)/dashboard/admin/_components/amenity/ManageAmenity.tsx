import { CreateAmenityForm } from "./CreateAmenityForm";
import GetAmenity from "./GetAmenity";

const ManageAmenity = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
                <CreateAmenityForm />
            </div>
            <div className="col-span-2">
                <GetAmenity />
            </div>
        </div>
    );
};

export default ManageAmenity;
