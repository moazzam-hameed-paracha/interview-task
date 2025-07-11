import { GlobalApiResponse, GlobalErrorResType } from "@/types/api";
import type { ZodSchema, z } from "zod";

export enum tagTypes {
  AUTH = "AUTH",
  TASKS = "TASKS",
  USERS = "USERS",
  WEBSOCKET = "WEBSOCKET",
}

interface FetchProps<ReqType> {
  request: ReqType;
  fetchFn: {
    input: string | URL | Request;
    init?: RequestInit;
    options?: {
      skipAuthorization?: boolean;
      skipContentType?: boolean;
      isBlob?: boolean;
    };
  };
  type: keyof typeof tagTypes;
}

let invalidTokenIgnore = 0;

export const fetchWithValidation = async <
  ReqSchema extends ZodSchema<any>,
  ResSchema extends ZodSchema<any>
>(
  props: FetchProps<z.infer<ReqSchema>> & {
    reqSchema: ReqSchema;
    resSchema: ResSchema;
  }
): Promise<z.infer<ResSchema>> => {
  type ResType = z.infer<ResSchema>;

  // Validate the request body
  const reqValidation = props.reqSchema.safeParse(props.request);
  if (!reqValidation.success) {
    throw new Error(
      `[${props.type}]: Invalid request body: ${reqValidation.error}`
    );
  }

  const headers = new Headers(props.fetchFn.init?.headers);
  headers.set("credentials", "include");

  // Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!props.fetchFn.options?.skipContentType) {
    headers.set("Content-Type", "application/json");
  }
  if (!props.fetchFn.options?.skipAuthorization && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const headersObj: { [key: string]: string } = {};
  headers.forEach((value: string, key: string) => {
    headersObj[key] = value;
  });

  const response = await fetch(props.fetchFn.input, {
    ...props.fetchFn.init,
    headers: headersObj,
  });

  const ENDPOINT = props.fetchFn.input.toString().split("/api").pop();

  if (!response.ok) {
    let err: GlobalErrorResType | undefined = undefined;
    try {
      err = await response?.json();
    } catch (error) {
      /* empty */
    }

    if (err?.data.message === "Invalid token" && ++invalidTokenIgnore < 3) {
      console.log("Invalid token, retrying...");
    } else {
      invalidTokenIgnore = 0;
      console.error(
        `[${props.type}]-[API ERROR]-[${ENDPOINT}]: ` +
          (err?.data?.message || `${response.status} - ${response.statusText}`)
      );
    }

    throw new Error(
      (err?.data?.message as string) ||
        `${response.status} - ${response.statusText}`
    );
  }

  invalidTokenIgnore = 0;

  if (props.fetchFn.options?.isBlob) {
    return response.blob() as unknown as z.infer<ResSchema>;
  }

  // Parse the response
  const result: GlobalApiResponse<ResType> = await response.json();

  if (result.data.result === null) {
    result.data.result = undefined;
  }

  // Validate the response body
  const resValidation = props.resSchema.safeParse(result?.data?.result);
  if (!resValidation.success) {
    console.log("res", result?.data?.result, props.resSchema);
    console.error(
      `[${props.type}]-[INVALID BODY]-[${ENDPOINT}]: `,
      JSON.stringify(resValidation.error, null, 2)
    );
    throw new Error(`${resValidation.error}`);
  }

  if (!result.success) {
    console.error(
      `[${props.type}]-[INVALID BODY]-[${ENDPOINT}]: `,
      JSON.stringify(resValidation.error, null, 2)
    );
    throw new Error(`${result?.data?.message}`);
  }

  return result?.data.result as ResType;
};
