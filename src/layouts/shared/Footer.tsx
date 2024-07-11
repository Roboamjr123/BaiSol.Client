
const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-orange-400 w-full mt-auto">
      <div className="flex justify-center items-center h-20 px-10">
      <span className='text-white tracking-wide'>© {currentYear} BaiSol. All Rights Reserved.</span>
      </div>
    </footer>
  )
}

export default Footer