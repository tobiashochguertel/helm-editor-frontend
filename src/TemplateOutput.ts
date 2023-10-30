import * as jsYaml from 'js-yaml';

export type Content = {
    filename: string
    content?: string
    type: string
}

export default async function helmChartTemplateOutput(
    chart: Map<string, Content>,
    template: Content,
    myValuesOverride?: string,
) {

    let valuesYaml: string = chart.get('values.yaml')?.content || "";
    if (myValuesOverride !== undefined) {
        const myConfigJson: object = jsYaml.load(myValuesOverride) as object;
        const chartConfigJson: object = jsYaml.load(chart.get('values.yaml')?.content || "") as object;
        const mergedConfig: object = { ...chartConfigJson, ...myConfigJson };
        valuesYaml = jsYaml.dump(mergedConfig)
    }

    const result = await fetch(`/api/template`, {
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