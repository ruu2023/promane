export function TaskSkeleton() {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`
        inline-block 
        h-4 w-4 border-2
        rounded-full 
        border-solid 
        border-current 
        border-r-transparent 
        align-[-0.125em] 
        motion-reduce:animate-[spin_1.5s_linear_infinite] 
        animate-spin 
        
      `}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
