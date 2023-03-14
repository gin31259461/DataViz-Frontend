import useSWR from 'swr';

export interface sqlServerObjectProps {
  OID: number;
  Type: number;
  CName: string;
  CDes: string;
  Since: string;
  LastModifiedDT: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export function useDataFromOID(mid: number | null, oid: number) {
  const { data, error } = useSWR(`/api/member/${mid}/data/${oid}`, fetcher);
  //if (error) return <div>Failed to load</div>
  //if (!data) return <div>Loading...</div>
  return data;
}

export function useDataObject(mid: number) {
  const { data, error } = useSWR(`/api/member/${mid}/data/`, fetcher);
  //if (error) return <div>Failed to load</div>
  //if (!data) return <div>Loading...</div>
  return data;
}
