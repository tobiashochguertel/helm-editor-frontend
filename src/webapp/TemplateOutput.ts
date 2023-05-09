import Renderer from './Renderer';
// import * as matter from 'gray-matter';
import * as jsYaml from 'js-yaml';

import { defaultKubernetesVersion } from "./Settings/kubernetesVersions"

export type Filename = string;
export type Filecontent = string;

export default async function helmChartTemplateOutput(
  filesAndContent: Map<Filename, Filecontent>,
  template: string,
  myValuesOverride?: string,
) {

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

  const filesToRender: { [key: string]: string } = {};
  /*   filesAndContent.forEach((value, key) => {
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
      if (key === ".helmignore") return;
      if (key === ".dockerignore") return;
      // if (key === "templates/_ingress-annotations.yaml") return;
      // if (key === "templates/_helpers.tpl") return;
  
      // Show the loaded Chart Files, which are loaded additional to the selected template file:
      // console.debug("key", key)
      filesToRender[key] = value
    }); */


  filesToRender['templates/_ingress-annotations.yaml'] = filesAndContent.get('templates/_ingress-annotations.yaml') || "";
  filesToRender['templates/_helpers.tpl'] = filesAndContent.get('templates/_helpers.tpl') || "";

  if (template !== undefined) {
    filesToRender['template'] = template || "";
  }

  let valuesYaml = filesAndContent.get('values.yaml');
  if (myValuesOverride !== undefined) {
    const myConfigJson: object = jsYaml.load(myValuesOverride) as object;
    const chartConfigJson: object = jsYaml.load(filesAndContent.get('values.yaml') || "") as object;
    const mergedConfig: object = { ...chartConfigJson, ...myConfigJson };
    valuesYaml = jsYaml.dump(mergedConfig)

    console.debug("mergedConfig", mergedConfig);
  }

  const renderer = await Renderer;
  const result = renderer(
    JSON.stringify(filesToRender),
    valuesYaml, // filesAndContent.get('values.yaml')
    filesAndContent.get('Chart.yaml'),
    getSettingsObject()
  );

  console.debug("result", result);

  return result.result;
}