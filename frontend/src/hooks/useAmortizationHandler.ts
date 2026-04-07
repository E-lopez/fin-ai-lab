import DataInfo from "@/constants/DataInfo";
import { repaymentPlanRequest } from "@/models/dto/repaymentPlanRequest";
import { AmortizationService } from "@/services/legacy/amortizationService/amortizationService";
import { useAlertDispatch } from "@/stores/alerts/AlertsStore";


export function useAmortizationHandler() {
    const alertDispatch = useAlertDispatch();


    const handleRepaymentPlan = async (payload: repaymentPlanRequest, access_token: string) => {
      return AmortizationService.getRepaymentPlan(payload, access_token)
      .then((res) => {

        alertDispatch({
          type: "SET_ALERT",
          alertType: "success",
          name: res.message || "Operación completada.",
          message: DataInfo.get(res.message ?? "DEFAULT")
        });
        return {success: true};
      })
      .catch((err: any) => {
        throw err;
      })
    };

    return {
      handleRepaymentPlan,
    }
}