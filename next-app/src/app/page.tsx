import ExcalidrawEditor from "@/component/Canvas";
import Pannel from "@/component/Pannel";
const ExcalidrawPage = () => {
  return (
    <main className="flex">
      <div className="w-[70%]"> 
      <ExcalidrawEditor />
      </div> 
<Pannel />

    </main>
  );
};

export default ExcalidrawPage;
