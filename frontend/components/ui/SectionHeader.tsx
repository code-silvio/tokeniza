interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
}

export function SectionHeader({ title, subtitle, icon }: Props) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && <span className="text-3xl">{icon}</span>}
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
