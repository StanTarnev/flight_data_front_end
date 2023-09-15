export default function MultiValueStat({title, stat}) {
    return (
        <div>
          <h2>{title}</h2>
          <ul>
            {stat}
          </ul>
        </div>
    )
}