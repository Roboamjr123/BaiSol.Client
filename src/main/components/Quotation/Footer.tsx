const Footer = () => {
  return (
    <div>
      <div className="flex justify-between items-start gap-6 ml-3 mr-4 w-full">
        {/* First Block */}
        <div className="w-2/3 border bg-white shadow-md">
          <div className="bg-blue-500 text-black p-2">
            <p className="font-bold text-sm">Special Notes and Instructions</p>
          </div>
          <div className="p-3 gap-2 text-sm">
            <p className="text-black text-xs">
              Once signed, please Fax, mail or email it to the provided address.
            </p>
            <p className="text-black pt-2 text-xs">Payment Terms:</p>
            <p className="text-black font-bold">
              60% downpayment, 30% progress billing, and 10% after installation.
            </p>
            <p className="text-black font-bold">
              Note: Installation period is around 7 days.
            </p>
          </div>
        </div>

        {/* Second Block */}
        <div className="bg-white-100 shadow-m w-1/3 flex flex-col items-end pr-3">
          <table className="border-collapse text-sm">
            <tbody>
              <tr>
                <td className=" px-4 py-1  font-semibold text-gray-700">
                  Subtotal
                </td>
                <td className=" px-4 py-1"> P 302,000.00</td>
              </tr>
              <tr>
                <td className=" px-4 py-1 font-semibold text-gray-700">
                  Discount
                </td>
                <td className="border px-4 py-1 text-right"> 50%</td>
              </tr>
              <tr>
                <td className=" px-4 py-1  font-semibold text-gray-700">
                  Vat Rate
                </td>
                <td className="border px-4 py-1 text-right"> 2%</td>
              </tr>
              <tr>
                <td className=" px-4 py-1 font-semibold  text-gray-700">VAT</td>
                <td className=" px-4 py-1 text-right">60.%</td>
              </tr>
              <tr>
                <td className=" px-4 py-1 font-semibold  text-gray-700">
                  Total
                </td>
                <td className=" px-4 py-1 text-right">P 302,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Additional Information  */}
      <div className=" items-center gap-6 ml-3 mr-4 py-3 ">
        <div className="text-sm text-center">
          <p>
            Above information is not an invoice and only an estimate of
            services/goods described above
          </p>
          <p>
            Payment will be collected in prior to provision of services/goods
            described in this quote.
          </p>
          <div className="items-center gap-4 mt-2">
            <p>
              Please confirm your acceptance of this quote by signing this
              document
            </p>
          </div>
        </div>
        {/* Textbox */}
        <div className="flex justify-between items-center gap-4 mt-2">
          {/* Signature Textbox */}
          <div className="w-1/3">
            <input
              type="text"
              disabled={true}
              className="w-full border border-gray-300 p-2 text-gray-500 text-xs"
              placeholder="Signature"
            />
          </div>

          {/* Printed Name Textbox */}
          <div className="w-1/3">
            <input
              type="text"
              disabled={true}
              className="w-full border border-gray-300 p-2 text-gray-500 text-xs"
              placeholder="Printed Name"
            />
          </div>

          {/* Date Textbox */}
          <div className="w-1/3">
            <input
              type="text"
              disabled={true}
              className="w-full border border-gray-300 p-2 text-gray-500 text-xs"
              placeholder="Date"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-1">
          <h2 className="text-xl font-bold">Thank you for your business!</h2>
        </div>
        <div className="flex justify-center items-center gap-4 mt-1">
          <p className="text-sm">
            Should you have any enquiries concerning this quote, please contact
            Richard R. Lonzaga on 0967-145-5851
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 mt-1">
          <p className="text-sm">
            Sitio Cacao Kamagong St., La Paloma Subd., Cebu City, Cebu, 6000
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 mt-1">
          <p className="text-sm">
            Tel: 032-344-7938 Fax: 0-000-000-0000 E-mail:
            richard.lonzaga@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
