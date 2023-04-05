// 获取配置静态标签
import icon1 from '@/assets/images/style/static/style1.png'
import icon2 from '@/assets/images/style/static/style2.png'
import icon3 from '@/assets/images/style/static/style3.png'
import icon4 from '@/assets/images/style/static/style4.png'
import icon5 from '@/assets/images/style/static/style5.png'
import icon6 from '@/assets/images/style/static/style6.png'
import icon7 from '@/assets/images/style/static/style7.png'
import icon8 from '@/assets/images/style/static/style8.png'
export function getStaticLabel(param) {
    switch (param) {
        case "1":
            return icon1
            break;
        case "2":
            return icon2
            break;
        case "3":
            return icon3
            break;
        case "4":
            return icon4
            break;
        case "5":
            return icon5
            break;
        case "6":
            return icon6
            break;
        case "7":
            return icon7
            break;
        case "8":
            return icon8
            break;
    }
}