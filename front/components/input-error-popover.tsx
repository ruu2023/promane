type Props = {
  message?: string;
};

export function InputErrorPopover({ message }: Props) {
  if (!message) {
    return null;
  }

  return (
    // position relative な親要素 (CustomInputのdiv) の左下に配置
    // -ml-1 で少し左に寄せる (親のpaddingなどによって調整)
    // mt-2 で input との間隔を設ける
    <div className="absolute left-0 -ml-1 mt-2 z-10 w-max max-w-xs">
      {/* エラーメッセージ本体 */}
      <div className="relative bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md shadow-lg">
        <p className="text-sm">{message}</p>

        {/* 左上向きの矢印部分 (画像のデザインに合わせる) */}
        {/* top-0 でメッセージボックスの上辺に配置 */}
        {/* left-4 で少し右に寄せる (親のpaddingやデザインに合わせて調整) */}
        {/* -translate-y-1/2 でボックスの上辺から半分上に飛び出すように配置 */}
        {/* bg-red-100 border-t border-l border-red-400 transform rotate-45 で三角形を作成 */}
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
