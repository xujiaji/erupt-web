/**
 * Created by liyuepeng on 10/17/18.
 */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tree } from "../model/erupt.model";
import { Page } from "../model/page";
import { _HttpClient } from "@delon/theme";
import { Observable } from "rxjs";
import { loginModel } from "../model/user.model";
import { EruptApiModel } from "../model/erupt-api.model";
import { EruptPageModel } from "../model/erupt-page.model";

@Injectable()
export class DataService {

  public domain: string = window["domain"];

  public upload: string = this.domain + "/erupt-api/file/upload/";

  eruptHeaderKey: String = "erupt";

  constructor(private http: HttpClient, private _http: _HttpClient) {
  }

  //获取结构
  getEruptBuild(modelName: string): Observable<EruptPageModel> {
    return this._http.get<EruptPageModel>(this.domain + "/erupt-api/build/list/" + modelName, null, {
      responseType: "json",
      headers: {
        eruptKey: modelName
      }
    });
  }

  //查询tree数据结构数据
  queryEruptTreeData(modelName: string): Observable<Array<Tree>> {
    return this._http.post<Array<Tree>>(this.domain + "/erupt-api/data/tree/" + modelName, {}, {});
  }

  //查询数据
  queryEruptData(modelName: string, condition: any, page: Page): Observable<Page> {
    return this.http.post<Page>(this.domain + "/erupt-api/data/table/" + modelName, { ...page }, {
      headers: {
        eruptKey: modelName
      }
    });
  }

  //根据id获取数据
  queryEruptSingleData(modelName: string, id: any): Observable<EruptApiModel> {
    return this._http.get<EruptApiModel>(this.domain + "/erupt-api/data/" + modelName + "/" + id, {});
  }

  //执行自定义operator方法
  execOperatorFun(modelName: string, operatorCode: string, data: any, param: object) {
    return this.http.post<EruptApiModel>(this.domain + "/erupt-api/data/" + modelName + "/operator/" + operatorCode, {
      data: data,
      param: param
    }, {
      headers: {
        eruptKey: modelName
      }
    });
  }

  //获取reference数据
  queryEruptReferenceData(modelName: string, refName: string): Observable<any> {
    return this._http.get(this.domain + "/erupt-api/data/" + modelName + "/ref/" + refName);
  }

  //增加数据
  addEruptData(modelName: string, data: any): Observable<EruptApiModel> {
    return this.http.post<EruptApiModel>(this.domain + "/erupt-api/data/" + modelName, data, {
      headers: {
        eruptKey: modelName
      }
    });
  }

  //删除数据
  deleteEruptData(modelName: string, id): Observable<EruptApiModel> {
    return this.http.delete<EruptApiModel>(this.domain + "/erupt-api/data/" + modelName + "/" + id, {
      headers: {
        eruptKey: modelName
      }
    });
  }

  //批量删除数据
  deleteEruptDatas(modelName: string, ids: Array<any>): Observable<EruptApiModel> {
    return this.http.delete<EruptApiModel>(this.domain + "/erupt-api/data/" + modelName, {
      params: {
        ids: ids
      },
      headers: {
        eruptKey: modelName
      }
    });
  }

  downloadEruptExcel(modelName: string): Observable<any> {
    return this.http.get(this.domain + "/erupt-api/excel/" + modelName, {
      headers: {
        eruptKey: modelName
      }
    });
  }

  //获取二维码
  getVerifyCodeUrl(account: string): string {
    return this.domain + "/ws/code-img" + "?account=" + account + "&_t" + new Date().getTime();
  }

  //登录接口
  login(account: string, pwd: string, verifyCode?: any): Observable<loginModel> {
    return this._http.post(this.domain + "/ws/login", {}, {
        account: account,
        pwd: pwd,
        verifyCode: verifyCode
      }
    );
  }

  //获取菜单接口
  getMenu(): Observable<any> {
    return this.http.post(this.domain + "/ws/menu", null);
  }
}
