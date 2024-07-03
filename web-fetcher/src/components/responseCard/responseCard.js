function CardResponse(props) {
  return (
    <h1 className="text-center text-pretty">
      {props.data ? props.data.message : "Please enter a url to fetch data."}
    </h1>
  );
}

export default CardResponse;
