import { HttpService } from '../services/http/http.service'
import { environment } from '../../environments/environment';
   
export function getPath(serverURL:string, path:string):string {
    // console.log(`getPath`, `http://${serverURL}:${environment.portGraphql}/` + path);
    return `http://${serverURL}:${environment.portGraphql}/` + path;
}
    
export function getDataGraphql(httpSv:HttpService, graphqlQuery: { query: string }, functionName: string, thisParent:any, callbackFnName: string, callbackFnErrName?: string) {
    let resposta: { errCode: number; errMsg: string; data: any; } | null = null;

    httpSv.getDataGraphql(getPath(httpSv.getServerURL(), 'graphql'), graphqlQuery, 1).subscribe(
        res => {
            let errCode = 0;
            let errMsg = "";  
            if (res.errors) {
                console.log("Erros", res.errors);
                errCode = res.errors[0].status;
                errMsg = res.errors[0].message;
            } 
            resposta = { errCode:errCode, errMsg:errMsg, data:res.data[functionName] };
        },
        err => {
           console.log("Err", functionName, err, err.errors);
           let errCode = -1;
           let errMsg = "Erro desconhecido";  
           if (err.errors) {
               errCode = err.errors[0].status;
               errMsg = err.errors[0].message;
           } 
        //    console.log("graphql error:", err);
           if (callbackFnErrName && typeof thisParent[callbackFnErrName] === 'function') { thisParent[callbackFnErrName]({ errCode:errCode, errMsg:errMsg }); }
           else if (callbackFnName && typeof thisParent[callbackFnName] === 'function') { thisParent[callbackFnName]({ errCode:errCode, errMsg:errMsg, data:[] }); }
        },
        () => {
            //(callbackFn) ? callbackFn(resposta) : null;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (callbackFnName && typeof thisParent[callbackFnName] === 'function') ? thisParent[callbackFnName](resposta) : null;
        }
    );
}  
