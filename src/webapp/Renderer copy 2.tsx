import { useEffect, useState } from "react";
import { defaultKubernetesVersion } from "./Settings/kubernetesVersions"

export type Filename = string;
export type Filecontent = string;

function Renderer({ filesAndContent, template }: {
  filesAndContent: Map<Filename, Filecontent>,
  template?: string,
}) {
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [wasmError, setWasmError] = useState(false);
  const [wasmErrorMessage, setWasmErrorMessage] = useState('');

  const getSettingsObject = () => {
    return {
      release: {
        name: 'sample',
        namespace: 'default',
        isUpgrade: "false",
        isInstall: "false",
        revision: "1",
        service: 'Helm',
      },
      kubeVersion: {
        version: defaultKubernetesVersion,
      },
      helmVersion: {
        version: "v3.7.2",
        gitCommit: "663a896f4a815053445eec4153677ddc24a0a361",
        gitTreeState: "clean",
        goVersion: "go1.17.3",
      },
    }
  }

  const [output, setOutput] = useState("");
  const [outputRendered, setOutputRendered] = useState(false);

  const filesToRender: { [key: string]: string } = {};
  filesAndContent.forEach((value, key) => {
    if (key === "values.yaml") return;
    if (key === "templates") return;
    if (key === "charts") return;
    if (key === "Chart.yaml") return;
    if (key === "README.md") return;
    if (key === "templates/NOTES.txt") return;
    if (key === "templates/worker-deployment.yaml") return;
    if (key === "templates/service.yaml") return;
    if (key === "templates/service-account.yaml") return;
    if (key === "templates/redirect.yaml") return;
    if (key === "templates/pvc.yaml") return;
    if (key === "templates/postgres-instance.yaml") return;
    if (key === "templates/pdb.yaml") return;
    if (key === "templates/network-policy.yaml") return;
    if (key === "templates/ingress.yaml") return;
    if (key === "templates/https-ingress-route.yaml") return;
    if (key === "templates/http-ingress-route.yaml") return;
    if (key === "templates/hpa.yaml") return;
    if (key === "templates/deployment.yaml") return;
    if (key === "templates/db-migrate-hook.yaml") return;
    if (key === "templates/db-initialize-job.yaml") return;
    if (key === "templates/cronjob.yaml") return;
    // if (key === "templates/_ingress-annotations.yaml") return;
    // if (key === "templates/_helpers.tpl") return;
    console.debug("key", key)
    filesToRender[key] = value
  });

  if (template !== undefined) {
    filesToRender['template'] = filesAndContent.get(template) || "";
  }

  useEffect(() => {
    if (wasmLoaded != true) {
      const wasm = fetch('main.wasm');
      wasm.then(response => {
        const go = new Go()
        WebAssembly.instantiateStreaming(response, go.importObject)
          .then((result) => {
            go.run(result.instance);
            window.helmRender = helmRender;
            setWasmLoaded(true)
          })
          .catch((err: Error) => {
            console.error('webassembly instantiate error', err)
            setWasmError(true);
            setWasmErrorMessage('could not instantiate helm renderer: ' + err)
          })
      });
    }

    if (wasmLoaded === true) {
      const result = window.helmRender(
        JSON.stringify(filesToRender),
        filesAndContent.get('values.yaml'),
        filesAndContent.get('Chart.yaml'),
        getSettingsObject()
      )

      // console.debug("result", result);

      setOutput(result.result);
      setOutputRendered(true);
    }
  }, [wasmLoaded, output, filesToRender, filesAndContent, wasmErrorMessage])

  if (!wasmLoaded) { return (<>Loading wasm...</>) }
  if (wasmError) { return (<>{wasmErrorMessage}</>) }
  if (!outputRendered) { return (<>Rendering...</>) }
  return (
    <>
      {output}
    </>
  );
}

export default Renderer;