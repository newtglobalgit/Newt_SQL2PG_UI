pipeline {

	 agent {
        node {
            label 'build_slave'
        }
    }
	triggers {
       // poll repo every 2 minute for changes
       pollSCM('*/1 * * * *')
   }
	
	environment {
		APPLICATION_NAME = "DMAP_UI_SONAR_ANALYSIS"
		NOTIFYUSERS = 'damanp@newtglobal.com,kavyasrim@newtglobal.com,debendrak@newtglobalcorp.com,chimanshu@newtglobalcorp.com,sumeets@newtglobalcorp.com,saimaa@newtglobalcorp.com,dsuresh@newtglobal.com,sugaantm@newtglobal.com,jasvirr@newtglobalcorp.com,leonig@newtglobalcorp.com,hemanthk@newtglobalcorp.com,madhavi@newtglobal.com'
		BUILD_DETAILS = "<BR>Job Name: ${env.JOB_NAME} <BR>Build Number: ${env.BUILD_NUMBER} <BR>Build URL: ${BUILD_URL}"
        
	}
	
	parameters {
        string(name: 'branch', defaultValue: 'Developer', description: 'Enter the branch for the build')
		string(name: 'sonarTypes', defaultValue: 'VULNERABILITY,BUG,CODE_SMELL', description: 'Enter the sonarQube issue types to certify the build')
        string(name: 'sonarSeverities', defaultValue: 'CRITICAL,BLOCKER,MAJOR', description: 'Enter the sonarQube issue severities to certify the build')
    }
	
	options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
	
	stages {
    
    stage ("Build") {
			steps {
				echo "Building the code"
				sh "npm install"
			}
		}
		
		stage ("Sonar_Analysis") {
			steps{
			    sh "sonar-scanner \
				-Dsonar.projectKey=dmap_UI \
				-Dsonar.projectName=dmap_UI \
				-Dsonar.sources=. \
				-Dsonar.host.url=http://192.168.3.76:9000/sonarqube \
				-Dsonar.login=25534cb4ff60d377ca72aefd244d70eff8bfcf56"
			}
		}
		
		stage ("Tests"){
			steps{
			    echo "Started Snyk Tests"
				snykSecurity failOnIssues: false, snykInstallation: 'SnykV2PluginTest', snykTokenId: 'Snyk_API'
				
				echo "Running Sonar Analysis"
				sh "cd SonarQube; node sonar.ts 192.168.3.76 9000/sonarqube ${params.sonarTypes} ${params.sonarSeverities} | tee output.log"
				
				sh '! grep "SonarQube Failed" SonarQube/output.log' 
				
				publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'SonarQube', reportFiles: 'sonarAnalysis.html', reportName: 'SonarQube Analysis Result', reportTitles: 'SonarQube Result'])
			}
		}
		
	}
	
	
	post {
        always {
            emailext attachmentsPattern: 'DMAPP_UI_snyk_report.html,SonarQube/sonarAnalysis.html',
            subject: "Jenkins Job Report For ${APPLICATION_NAME} - ${currentBuild.currentResult}",
			body: "BUILD DETAILS: ${BUILD_DETAILS} <BR>BUILD STATUS: ${currentBuild.currentResult}",
			to: "${NOTIFYUSERS}"
        }
    }
}
