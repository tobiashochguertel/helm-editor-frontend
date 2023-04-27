import { Col, Container, Row } from 'react-bootstrap';
import { PlusCircle } from 'react-feather';
import React from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';

function App() {
  const [code, setCode] = React.useState("{{- if and (not .Values.application.initializeCommand) .Values.cronjobs -}}\napiVersion: v1\nkind: List\nitems:\n{{- range $jobName, $jobConfig:= .Values.cronjobs }}\n{{- if $.Capabilities.APIVersions.Has \"batch/v1\" }}\n- apiVersion: \"batch/v1\"\n{{- else }}\n- apiVersion: \"batch/v1beta1\"\n{{- end }}\n  kind: CronJob\n  metadata:\n    name: \"{{ template \"trackableappname\" $ }}-{{ $jobName}}\"\n    annotations:\n      {{ if $.Values.gitlab.app }}app.gitlab.com/app: {{ $.Values.gitlab.app | quote }}{{ end }}\n      {{ if $.Values.gitlab.env }}app.gitlab.com/env: {{ $.Values.gitlab.env | quote }}{{ end }}\n    labels:\n      track: \"{{ $.Values.application.track }}\"\n      tier: \"{{ $.Values.application.tier }}\"\n      {{ include \"sharedlabels\" $ | nindent 6 }}\n  spec:\n    concurrencyPolicy: {{ default \"Forbid\" $jobConfig.concurrencyPolicy }}\n    failedJobsHistoryLimit: {{ default 1 $jobConfig.failedJobsHistoryLimit }}\n    startingDeadlineSeconds: {{ default 300 $jobConfig.startingDeadlineSeconds }}\n    schedule: {{ $jobConfig.schedule | quote }}\n    successfulJobsHistoryLimit: {{ default 1 $jobConfig.successfulJobsHistoryLimit }}\n    jobTemplate:\n      spec:\n        {{- if $jobConfig.activeDeadlineSeconds }}\n        activeDeadlineSeconds: {{ $jobConfig.activeDeadlineSeconds }}\n        {{- end }}\n        {{- if $jobConfig.backoffLimit }}\n        backoffLimit: {{ $jobConfig.backoffLimit }}\n        {{- end }}\n        template:\n          metadata:\n            annotations:\n              checksum/application-secrets: \"{{ $.Values.application.secretChecksum }}\"\n              {{ if $.Values.gitlab.app }}app.gitlab.com/app: {{ $.Values.gitlab.app | quote }}{{ end }}\n              {{ if $.Values.gitlab.env }}app.gitlab.com/env: {{ $.Values.gitlab.env | quote }}{{ end }}\n              {{- if $.Values.podAnnotations }}\n              {{ toYaml $.Values.podAnnotations | nindent 12 }}\n              {{- end }}\n            labels:\n              app: {{ template \"appname\" $ }}\n              release: {{ $.Release.Name }}\n              track: \"{{ $.Values.application.track }}\"\n              tier: cronjob\n          spec:\n            imagePullSecrets:\n              {{ toYaml $.Values.image.secrets | nindent 14 }}\n            restartPolicy: {{ default \"OnFailure\" $jobConfig.restartPolicy }}\n            {{- with $nodeSelectorConfig := default $.Values.nodeSelector $jobConfig.nodeSelector -}}\n            {{- if $nodeSelectorConfig  }}\n            nodeSelector:\n            {{ toYaml $nodeSelectorConfig | nindent 14 }}\n            {{- end }}\n            {{- end }}\n            {{- with $tolerationsConfig := default $.Values.tolerations $jobConfig.tolerations -}}\n            {{- if $tolerationsConfig }}\n            tolerations:\n            {{ toYaml $tolerationsConfig | nindent 14 }}\n            {{- end }}\n            {{- end }}\n            {{- with $affinityConfig := default $.Values.affinity $jobConfig.affinity -}}\n            {{- if $affinityConfig  }}\n            affinity:\n            {{ toYaml $affinityConfig | nindent 14 }}\n            {{- end }}\n            {{- end }}\n            {{- if $jobConfig.extraVolumes }}\n            volumes:\n            {{ toYaml $jobConfig.extraVolumes | nindent 14 }}\n            {{- end }}\n            containers:\n            - name: {{ $.Chart.Name }}\n              image: \"{{ template \"cronjobimagename\" (dict \"job\" . \"glob\" $.Values) }}\"\n              imagePullPolicy: {{ $.Values.image.pullPolicy }}\n              {{- if $jobConfig.command }}\n              command: \n              {{- range $jobConfig.command }}\n              - {{ . }}\n              {{- end }}\n              {{- end }}\n              {{- if $jobConfig.command }}\n              args: \n              {{- range $jobConfig.args }}\n              - {{ . }}\n              {{- end }}\n              {{- end }}\n              {{- if $.Values.application.secretName }}\n              envFrom:\n              - secretRef:\n                  name: {{ $.Values.application.secretName }}\n{{- if $jobConfig.extraEnvFrom }}\n{{ toYaml $jobConfig.extraEnvFrom | nindent 14 }}\n{{- end }}\n              {{- else }}\n              envFrom:\n{{- if $jobConfig.extraEnvFrom }}\n{{ toYaml $jobConfig.extraEnvFrom | nindent 14 }}\n{{- end }}\n              {{- end }}\n              env:\n              {{- if $.Values.postgresql.managed }}\n              - name: POSTGRES_USER\n                valueFrom:\n                  secretKeyRef:\n                    name: app-postgres\n                    key: username\n              - name: POSTGRES_PASSWORD\n                valueFrom:\n                  secretKeyRef:\n                    name: app-postgres\n                    key: password\n              - name: POSTGRES_HOST\n                valueFrom:\n                  secretKeyRef:\n                    name: app-postgres\n                    key: privateIP\n              {{- end }}\n              {{- if $.Values.application.database_url }}\n              - name: DATABASE_URL\n                value: {{ $.Values.application.database_url | quote }}\n              {{- end }}\n              - name: GITLAB_ENVIRONMENT_NAME\n                value: {{ $.Values.gitlab.envName | quote }}\n              - name: GITLAB_ENVIRONMENT_URL\n                value: {{ $.Values.gitlab.envURL | quote }}\n              ports:\n              - name: \"{{ $.Values.service.name }}\"\n                containerPort: {{ $.Values.service.internalPort }}\n              {{- with $livenessProbeConfig := default $.Values.livenessProbe $jobConfig.livenessProbe }}\n              {{- if $livenessProbeConfig }}\n              livenessProbe:\n              {{- if eq $livenessProbeConfig.probeType \"httpGet\" }}\n                httpGet:\n                  path: {{ $livenessProbeConfig.path }}\n                  scheme: {{ $livenessProbeConfig.scheme }}\n                  port: {{ default $.Values.service.internalPort $livenessProbeConfig.port }}\n              {{- else if eq $livenessProbeConfig.probeType \"tcpSocket\" }}\n                tcpSocket:\n                  port: {{ default $.Values.service.internalPort $.Values.service.internalPort }}\n              {{- else if eq $livenessProbeConfig.probeType \"exec\" }}\n                exec:\n                  command:\n                    {{ toYaml $livenessProbeConfig.command | nindent 18 }}\n              {{- end }}\n                initialDelaySeconds: {{ $livenessProbeConfig.initialDelaySeconds }}\n                timeoutSeconds: {{  $livenessProbeConfig.timeoutSeconds }}\n                failureThreshold: {{ $livenessProbeConfig.failureThreshold }}\n                periodSeconds: {{ $livenessProbeConfig.periodSeconds }}\n              {{- end }}\n              {{- end }}\n              {{- with $readinessProbe := default $.Values.readinessProbe  $jobConfig.readinessProbe }}\n              {{- if $readinessProbe  }}\n              readinessProbe:\n                {{- if eq $readinessProbe.probeType \"httpGet\" }}\n                httpGet:\n                  path: {{ $readinessProbe.path }}\n                  scheme: {{ $readinessProbe.scheme }}\n                  port: {{ default $.Values.service.internalPort $readinessProbe.port }}\n                {{- else if eq $readinessProbe.probeType \"tcpSocket\" }}\n                tcpSocket:\n                  port: {{ default $.Values.service.internalPort $readinessProbe.port }}\n                {{- else if eq $readinessProbe.probeType \"exec\" }}\n                exec:\n                  command:\n                    {{ toYaml $readinessProbe.command | nindent 18 }}\n                {{- end }}\n                initialDelaySeconds: {{ $readinessProbe.initialDelaySeconds }}\n                timeoutSeconds: {{ $readinessProbe.timeoutSeconds }}\n                failureThreshold: {{ $readinessProbe.failureThreshold }}\n                periodSeconds: {{ $readinessProbe.periodSeconds }}\n              {{- end }}\n              {{- end }}\n              resources:\n                {{ toYaml $.Values.resources | nindent 16 }}\n              {{- if $jobConfig.extraVolumeMounts }}\n              volumeMounts:\n              {{ toYaml $jobConfig.extraVolumeMounts | nindent 16 }}         \n              {{- end }}                \n{{- end -}}\n{{- end -}}\n");

  const [output, setOutput] = React.useState("");

  function editorDidMount(editor, monaco) {
    // console.log('editorDidMount', editor, monaco);
    editor.focus();
  }
  function onChange(newValue, e) {
    // console.log('onChange', newValue, e);
    setOutput(newValue);
  }

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: false,
    // theme: 'vs-dark',
    theme: 'vs-light',
    scrollbar: {
      // Subtle shadows to the left & top. Defaults to true.
      useShadows: false,
      // Render vertical arrows. Defaults to false.
      verticalHasArrows: true,
      // Render horizontal arrows. Defaults to false.
      horizontalHasArrows: true,
      // Render vertical scrollbar.
      // Accepted values: 'auto', 'visible', 'hidden'.
      // Defaults to 'auto'
      vertical: 'visible',
      // Render horizontal scrollbar.
      // Accepted values: 'auto', 'visible', 'hidden'.
      // Defaults to 'auto'
      horizontal: 'visible',
      verticalScrollbarSize: 17,
      horizontalScrollbarSize: 17,
      arrowSize: 30,
    },
  };

  const language_editor = "yaml";
  const language_render = "yaml";
  const height = "500px"

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">Company name</a>
        {/* <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <input className="form-control form-control-dark w-100 rounded-0 border-0" type="text" placeholder="Search"
          aria-label="Search">
          <div className="navbar-nav">
            <div className="nav-item text-nowrap">
              <a className="nav-link px-3" href="#">Sign out</a>
            </div>
          </div> */}
      </header>

      <Container fluid className="">
        <Row>
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-body-tertiary sidebar collapse">
            <div className="position-sticky pt-3 sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    <span data-feather="home" className="align-text-bottom"></span>
                    Dashboard
                  </a>
                </li>
              </ul>

              {/* List Files / Directories */}
              <h6
                className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>Files</span>
                <a className="link-secondary" href="#" aria-label="Add a new report">
                  <PlusCircle className='feather align-text-bottom' />
                </a>
              </h6>
              <ul className="nav flex-column mb-2">
                {/* <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text" className="align-text-bottom"></span>
                    Current month
                  </a>
                </li> */}
              </ul>
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {/* <div
              className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Dashboard</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                  <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
                </div>
                <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                  <span data-feather="calendar" className="align-text-bottom"></span>
                  This week
                </button>
              </div>
            </div> */}

            <Container fluid>
              <Row>
                {/* <Col>
                  <h6>Values</h6>
                </Col> */}
                <Col>
                  <h6>Selected File</h6>
                  <MonacoEditor
                    height={height}
                    editorDidMount={editorDidMount}
                    onChange={onChange}
                    language={language_editor}
                    value={code}
                    options={options}
                  />
                </Col>
                <Col>
                  <h6>Render Output</h6>
                  <MonacoEditor
                    height={height}
                    language={language_render}
                    value={output}
                    options={{ ...options, readOnly: true }}
                  />
                </Col>
              </Row>
            </Container>

          </main>

        </Row>
      </Container>
    </>
  )
}

export default App