import ManageAmenity from "./_components/amenity/ManageAmenity";
import ManageCategory from "./_components/category/ManageCategory";

const AdminDashboardPage = () => {
    return (
        <div>
            <h1>Admin dashboar</h1>
            <ManageCategory></ManageCategory>
            <ManageAmenity></ManageAmenity>
        </div>
    );
};

export default AdminDashboardPage;
