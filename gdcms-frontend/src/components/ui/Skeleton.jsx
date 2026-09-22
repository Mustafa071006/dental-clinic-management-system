export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

export const SkeletonText = ({ width = 'w-full', className = '' }) => (
  <Skeleton className={`h-3.5 ${width} ${className}`} />
);

/** Mimics a data table's rows while the real rows are loading. */
export const SkeletonTableRows = ({ rows = 5, columns = 5 }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, r) => (
      <tr key={r} className="border-b border-gray-50 last:border-0">
        {Array.from({ length: columns }).map((__, c) => (
          <td key={c} className="px-6 py-4">
            <Skeleton className={`h-4 ${c === 0 ? 'w-3/4' : 'w-2/3'}`} />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

/** Mimics a DoctorCard-style grid card while loading. */
export const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex flex-col items-center pt-8 pb-6">
      <Skeleton className="w-24 h-24 rounded-full mb-3" />
      <Skeleton className="h-6 w-40 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="border-t border-gray-100 px-8 py-6 space-y-4">
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3.5 w-1/2" />
      <Skeleton className="h-3.5 w-2/3" />
    </div>
  </div>
);

export default Skeleton;
