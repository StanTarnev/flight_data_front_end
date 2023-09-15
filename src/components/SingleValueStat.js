export default function SingleValueStat({title, getStat}) {
    return (
        <div>
          <h2>{title}</h2>
          <h3>{getStat()}</h3>
        </div>
    )
}