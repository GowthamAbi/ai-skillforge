export default function AIMentor( {
  busy,onEvaluate,offline
}) {
  return <button disabled= {
    busy
  } onClick= {
    onEvaluate
  } className="rounded-xl bg-violet-500 px-5 py-3 font-bold disabled:opacity-50"> {
    busy?'Evaluating…':(offline?'Calculate offline score':'Evaluate today with AI Mentor')
  }</button>
}
