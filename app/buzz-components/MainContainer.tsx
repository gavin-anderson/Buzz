import NavLayout from "@/app/buzz-components/NavLayout";

const MainContainer = ({ children }) => {
  return (
    <NavLayout>
      <div className="flex flex-1   ">
        {" "}
        {/* Adjust margin to match Sidebar width */}
        <div className="flex-1 flex justify-center   p-4 ">{children}</div>
      </div>
    </NavLayout>
  );
};

export default MainContainer;
