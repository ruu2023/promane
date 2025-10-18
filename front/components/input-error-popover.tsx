type Props = {
  message?: string;
};

export function InputErrorPopover({ message }: Props) {
  if (!message) {
    return null;
  }

  return (
    <div className="absolute left-0 -ml-1 mt-2 z-10 w-max max-w-xs">
      {/* エラーメッセージ本体 */}
      <div className="relative bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md shadow-lg">
        <p className="text-sm">{message}</p>
        <div
          className="
            absolute top-0 left-4 -translate-y-1/2 
            w-3 h-3 bg-red-100 border-t border-l border-red-400 
            transform rotate-45
          "
        />
      </div>
    </div>
  );
}
