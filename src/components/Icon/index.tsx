import classNames from 'classnames'

type Props = {
  type: string
  className?: string
  onClick?: (e?: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}
function Icon({ type, className, ...rest }: Props) {
  return (
    <svg {...rest} className={classNames('icon', className)} aria-hidden="true">
      <use xlinkHref={`#${type}`}></use>
    </svg>
  )
}

export default Icon
