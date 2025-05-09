"use client";
import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

type ApiTesterProps = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  parameters: { name: string; in: string; required: boolean }[];
  headers: string[];
};

type InputValues = {
  [key: string]: string;
};

const ApiTester: React.FC<ApiTesterProps> = ({ endpoint, method, parameters, headers }) => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [inputValues, setInputValues] = useState<InputValues>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleTestApi = async () => {
    try {
      setError(null);
      const url = endpoint.replace(/\{(.*?)\}/g, (_, key: string) => inputValues[key] || `{${key}}`);
      const config: AxiosRequestConfig = {
        method,
        url,
        headers: headers.reduce((acc: Record<string, string>, header: string) => {
          acc[header] = inputValues[header] || "";
          return acc;
        }, {}),
        data: method !== "GET" ? inputValues : undefined,
      };
      const res = await axios(config);
      setResponse(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response ? err.response.data : err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="api-tester">
      <h3>Test API: {method} {endpoint}</h3>
      {parameters.map((param) => (
        <div key={param.name}>
          <label>{param.name}:</label>
          <input
            type="text"
            name={param.name}
            placeholder={param.name}
            onChange={handleInputChange}
          />
        </div>
      ))}
      {headers.map((header) => (
        <div key={header}>
          <label>{header}:</label>
          <input
            type="text"
            name={header}
            placeholder={header}
            onChange={handleInputChange}
          />
        </div>
      ))}
      <button onClick={handleTestApi}>Test API</button>
      {response && (
        <div className="response">
          <h4>Response:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="error">
          <h4>Error:</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTester;