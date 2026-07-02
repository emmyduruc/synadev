// Native doesn't support server rendering — always return the client value.
export const useClientOnlyValue = <S, C>(_server: S, client: C): S | C => {
  return client;
};
