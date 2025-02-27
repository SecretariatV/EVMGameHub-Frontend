interface ISVGStylesType {
  width: number;
  height: number;
  viewBox: string;
  color: string;
  className?: string;
}

export const Vector = (data: ISVGStylesType) => {
  return (
    <svg
      width={data.width}
      height={data.height}
      viewBox={data.viewBox}
      className={data.className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M876 209V0H869.661V16.9003H857.863V0H838.81V11.0748H807.959V27.9751H780.771V0H758.97V16.3034H729.035V0H708.187V15.1506H682.758V0H652.823V6.97833H611.089V0H585.698V20.3998H561.185V0H542.132V11.0748H506.774V24.4756H473.211V5.82557H450.531V15.727H430.562V4.07584H402.422V18.0531H360.689V0H327.126V8.72806H298.986V0H273.594V8.15168H235.488V22.7259H211.012V0H189.211V12.2275H158.36V0H142.971V7.5753H95.7781V26.2254H74.0137V0H41.3304V10.4778H0V209H876Z"
        fill={data.color}
      />
    </svg>
  );
};
