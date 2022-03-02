import { useSearchParams } from "react-router-dom";

export const useSearchParams = (Component) => {
  const Wrapper = (props) => {
    //   const params = useParams();

    return <Component useParams={useSearchParams()} {...props} />;
  };

  return Wrapper;
};
