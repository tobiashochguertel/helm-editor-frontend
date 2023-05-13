import * as jsYaml from 'js-yaml';

import { defaultKubernetesVersion } from "./Settings/kubernetesVersions"

export type Filename = string;
export type Filecontent = string;

export type Content = {
  filename: string
  content?: string
  type: string
}

export default async function helmChartTemplateOutput(
  chart: Map<Filename, Content>,
  template: Content,
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

  let valuesYaml: string = chart.get('values.yaml')?.content || "";
  if (myValuesOverride !== undefined) {
    const myConfigJson: object = jsYaml.load(myValuesOverride) as object;
    const chartConfigJson: object = jsYaml.load(chart.get('values.yaml')?.content || "") as object;
    const mergedConfig: object = { ...chartConfigJson, ...myConfigJson };
    valuesYaml = jsYaml.dump(mergedConfig)
    // console.debug(valuesYaml);
  }

  const result = await fetch(`/template`, {
    method: 'POST',
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selection: template,
      myValues: valuesYaml,
      chart: Object.fromEntries(chart)
    }),
  }
  ).then(response => response.text()).then((data) => {
    return data;
  });

  return result;
}