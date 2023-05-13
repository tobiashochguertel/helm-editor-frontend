import Renderer from './Renderer';
import HelmRenderer from './HelmRenderer';
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

    // console.debug("mergedConfig", mergedConfig);
  }

  // https://github.com/shipmight/helm-playground/blob/master/lib.js
  const helmRenderer = await HelmRenderer;
  const resultNew = helmRenderer(filesToRender['template'], valuesYaml)
  console.debug("resultNew", resultNew);

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