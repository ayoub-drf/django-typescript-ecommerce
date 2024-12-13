import bookImage from "../assets/ebook.png";

const Landing = () => {
    return (
        <div className="container max-lg:flex-col p-5 dark:bg-gray-800 dark:text-white mt-8 justify-between gap-4 items-center flex flex-grow">
            <div className="text w-[50%] max-lg:w-full">
                <h2 className="text-[47px] mb-8 text-[#2196F3] font-bold ">Lorem ipsum dolor sit amet, consectetur </h2>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adip iscing elit. Mauris hendrerit eros ac fermentum Fusce sodales enim at efficitur sagittis consectetur adip iscing elit.</p>
            </div>
            <div className="image w-[50%] max-lg:w-full flex justify-center items-center">
                <img width={360} src={bookImage} alt="" />
            </div>
        </div>
    )
}

export default Landing