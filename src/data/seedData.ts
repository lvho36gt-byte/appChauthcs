import { Experiment, Question, StemProject, PrePostAssessment } from '../types/physics';

export const INITIAL_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-speed-measurement',
    title: 'Thí nghiệm 1: Đo tốc độ chuyển động',
    grade: 7,
    topic: 'Chuyển động và Tốc độ',
    difficulty: 'Cơ bản',
    curriculumRef: 'KHTN 7 - Chủ đề Tốc độ (Bộ sách Cánh Diều, Kết Nối Tri Thức, Chân Trời Sáng Tạo)',
    icon: 'Gauge',
    objectives: [
      'Xác định được tốc độ chuyển động của vật bằng thước và đồng hồ bấm giây.',
      'Rèn luyện kỹ năng thực hành: đo quãng đường s (m) và thời gian t (s) với độ chính xác cao.',
      'Biết tính toán và so sánh tốc độ v = s/t qua nhiều lần đo, rút ra nhận xét về tính ổn định của chuyển động.'
    ],
    backgroundKnowledge: 'Tốc độ là đại lượng đặc trưng cho sự nhanh hay chậm của chuyển động, được tính bằng quãng đường đi được chia cho khoảng thời gian đi quãng đường đó: v = s / t. Trong hệ SI, quãng đường đo bằng mét (m), thời gian đo bằng giây (s), tốc độ có đơn vị là mét trên giây (m/s) hoặc kilômét trên giờ (km/h với 1 m/s = 3,6 km/h).',
    equipment: [
      'Xe đồ chơi chuyển động bánh xe trơn (hoặc xe lăn thí nghiệm)',
      'Thước cuộn hoặc thước thẳng chia độ chính xác (đến 1 mm)',
      'Đồng hồ bấm giây điện tử hoặc đồng hồ bấm giờ trên điện thoại thông minh',
      'Băng keo đánh dấu vạch xuất phát (A) và vạch đích (B)',
      'Mặt phẳng trơn nhẵn (bàn gỗ hoặc sàn phẳng)'
    ],
    safetyNotes: [
      'Đặt xe ngay ngắn trước vạch xuất phát, không đẩy quá mạnh tránh văng khỏi bàn thí nghiệm.',
      'Bấm đồng hồ ngay khi đầu xe chạm vạch xuất phát và dừng ngay khi đầu xe chạm vạch đích.',
      'Thực hiện tối thiểu 3 lần đo với cùng quãng đường để tính giá trị trung bình.'
    ],
    drivingQuestion: 'Làm thế nào để biết một chiếc xe đồ chơi chuyển động nhanh hay chậm hơn một chiếc xe khác nếu quãng đường hoặc thời gian đi được của chúng không giống nhau?',
    hypothesisPrompt: 'Hãy dự đoán: Nếu tăng quãng đường chạy gấp đôi thì thời gian chuyển động sẽ thay đổi như thế nào nếu xe duy trì tốc độ gần như không đổi? Tốc độ tính được giữa các lần đo có bằng nhau tuyệt đối không?',
    steps: [
      {
        step: 1,
        title: 'Bố trí đường chạy',
        description: 'Dùng thước đo chính xác khoảng cách s giữa hai vạch A và B trên mặt bàn (ví dụ s = 1.0 m, 1.5 m hoặc 2.0 m). Dán băng keo đánh dấu.',
        tip: 'Nên chọn mặt phẳng sạch bụi để giảm thiểu ma sát bất thường.'
      },
      {
        step: 2,
        title: 'Thực hiện phép đo lần 1',
        description: 'Đặt xe tại vạch A. Thả xe chạy, đồng thời bấm đồng hồ bấm giây. Khi xe chạm vạch B, bấm dừng đồng hồ. Ghi nhận thời gian t1.',
        tip: 'Người thả xe và người bấm đồng hồ cần phối hợp khẩu lệnh 1-2-3 để tránh độ trễ phản xạ.'
      },
      {
        step: 3,
        title: 'Lặp lại phép đo lần 2 và 3',
        description: 'Giữ nguyên quãng đường s, thực hiện lại thao tác thêm 2 lần để có các thời gian t2, t3.',
        tip: 'Nếu có 1 lần bấm sai lệch quá lớn (do bấm nhầm), hãy loại bỏ và đo lại lần đó.'
      },
      {
        step: 4,
        title: 'Thay đổi quãng đường và tính toán',
        description: 'Thử nghiệm với một quãng đường khác (ví dụ s = 2.0 m) để so sánh tốc độ xe ở các cự li khác nhau.',
        tip: 'Phần mềm sẽ tự động tính tốc độ v = s / t và vận tốc trung bình.'
      }
    ],
    measurementFields: [
      { key: 'distance_m', label: 'Quãng đường (s)', unit: 'm', type: 'number', step: 0.05, min: 0.1 },
      { key: 'time_s', label: 'Thời gian (t)', unit: 's', type: 'number', step: 0.01, min: 0.05 }
    ],
    calculatedFormula: {
      targetKey: 'speed_ms',
      label: 'Tốc độ v = s/t',
      unit: 'm/s',
      formulaDesc: 'v = s / t (với s > 0 và t > 0)',
      calculate: (row) => {
        const s = Number(row.distance_m);
        const t = Number(row.time_s);
        if (s > 0 && t > 0) {
          return Number((s / t).toFixed(3));
        }
        return null;
      }
    },
    sampleData: [
      { trial: 1, distance_m: 2.0, time_s: 4.0 },
      { trial: 2, distance_m: 2.0, time_s: 3.95 },
      { trial: 3, distance_m: 2.0, time_s: 4.05 }
    ],
    applicationQuestions: [
      'Nếu một bạn học sinh chạy cự li 60 m trong thời gian 10 giây thì tốc độ trung bình của bạn đó là bao nhiêu m/s và km/h?',
      'Tại sao trong các cuộc thi chạy điền kinh, trọng tài phải sử dụng súng phát lệnh và đồng hồ điện tử cảm biến thay vì quan sát bấm tay thông thường?',
      'Dựa trên bảng số liệu của em, tại sao tốc độ tính được giữa các lần đo lại có sự chênh lệch nhỏ?'
    ],
    allowMediaUpload: true
  },
  {
    id: 'exp-light-reflection',
    title: 'Thí nghiệm 2: Khảo sát sự phản xạ ánh sáng',
    grade: 7,
    topic: 'Ánh sáng và Thị giác',
    difficulty: 'Cơ bản',
    curriculumRef: 'KHTN 7 - Định luật phản xạ ánh sáng',
    icon: 'Sun',
    objectives: [
      'Nhận biết tia tới, tia phản xạ, pháp tuyến, góc tới i và góc phản xạ i\'.',
      'Khảo sát mối quan hệ định lượng giữa góc phản xạ và góc tới khi ánh sáng gặp gương phẳng.',
      'Kiểm chứng định luật phản xạ ánh sáng: Tia phản xạ nằm trong mặt phẳng tới và góc phản xạ bằng góc tới (i\' = i).'
    ],
    backgroundKnowledge: 'Hiện tượng phản xạ ánh sáng xảy ra khi tia sáng truyền tới bề mặt phân cách giữa hai môi trường (như mặt gương phẳng) và bị hắt trở lại môi trường trong suốt ban đầu. Định luật phản xạ ánh sáng nêu rõ: Tia phản xạ nằm trong mặt phẳng chứa tia tới và pháp tuyến của gương ở điểm tới; Góc phản xạ luôn luôn bằng góc tới (i\' = i).',
    equipment: [
      'Gương phẳng nhỏ có giá đỡ thẳng đứng vuông góc',
      'Nguồn sáng phát chùm sáng hẹp hoặc bút laser học đường an toàn (công suất thấp < 1mW)',
      'Đĩa tròn chia độ (0 đến 90 độ hai bên pháp tuyến)',
      'Mặt phẳng bảng thí nghiệm'
    ],
    safetyNotes: [
      'TUYỆT ĐỐI KHÔNG chiếu tia laser trực tiếp vào mắt bạn bè hoặc nhìn thẳng vào đầu phát laser.',
      'Đặt đĩa chia độ phẳng phiu, mặt phản xạ của gương phải trùng đúng với đường kính 90° - 90° của đĩa.'
    ],
    drivingQuestion: 'Khi chiếu một tia sáng tới mặt gương phẳng với các góc nghiêng khác nhau, tia sáng phản xạ sẽ đi theo hướng nào? Có quy luật toán học nào giữa góc tới và góc phản xạ?',
    hypothesisPrompt: 'Dự đoán: Nếu góc tới i tăng dần từ 20° đến 60° thì góc phản xạ i\' sẽ tăng, giảm hay giữ nguyên? Em dự đoán giá trị i và i\' có bằng nhau không?',
    steps: [
      {
        step: 1,
        title: 'Căn chỉnh đĩa chia độ và gương',
        description: 'Đặt gương phẳng thẳng đứng tại tâm O của đĩa chia độ sao cho mặt phản xạ của gương trùng với vạch ngang 90° - 90°. Pháp tuyến ON trùng với vạch 0°.',
        tip: 'Đảm bảo gương thẳng đứng 90 độ so với mặt đĩa.'
      },
      {
        step: 2,
        title: 'Chiếu tia sáng tới góc 30°',
        description: 'Bật nguồn sáng, chiếu tia tới SI đi là là trên mặt đĩa tới điểm tới O sao cho góc tới i = 30°. Quan sát vệt tia phản xạ IR.',
        tip: 'Đọc góc phản xạ i\' tạo bởi tia IR và pháp tuyến ON.'
      },
      {
        step: 3,
        title: 'Thay đổi góc tới (40°, 50°, 60°)',
        description: 'Lần lượt xoay nguồn sáng để tạo các góc tới i = 40°, 50°, 60°. Đọc và ghi lại góc phản xạ i\' tương ứng.',
        tip: 'Ghi số liệu thật mà em quan sát được trên thước đo góc.'
      }
    ],
    measurementFields: [
      { key: 'angle_incidence', label: 'Góc tới i', unit: 'độ (°)', type: 'number', step: 1, min: 0 },
      { key: 'angle_reflection', label: 'Góc phản xạ i\'', unit: 'độ (°)', type: 'number', step: 1, min: 0 }
    ],
    calculatedFormula: {
      targetKey: 'angle_diff',
      label: 'Độ lệch tuyệt đối |i - i\'|',
      unit: 'độ (°)',
      formulaDesc: '|i - i\'| (Lý tưởng = 0°)',
      calculate: (row) => {
        const i = Number(row.angle_incidence);
        const ir = Number(row.angle_reflection);
        if (!isNaN(i) && !isNaN(ir)) {
          return Math.abs(i - ir);
        }
        return null;
      }
    },
    sampleData: [
      { trial: 1, angle_incidence: 30, angle_reflection: 30 },
      { trial: 2, angle_incidence: 45, angle_reflection: 45 },
      { trial: 3, angle_incidence: 60, angle_reflection: 60 }
    ],
    applicationQuestions: [
      'Nếu tia sáng tới vuông góc với mặt gương phẳng (góc tới i = 0°) thì tia phản xạ sẽ có phương và chiều như thế nào?',
      'Ứng dụng hiện tượng phản xạ ánh sáng: Người ta chế tạo kính tiềm vọng trong tàu ngầm bằng cách bố trí hai gương phẳng nghiêng một góc bao nhiêu độ?',
      'Nếu góc tới i = 35° nhưng em đo được i\' = 37° thì sai số 2° này có thể do những nguyên nhân thực tế nào gây ra?'
    ],
    allowMediaUpload: true
  },
  {
    id: 'exp-lever-balance',
    title: 'Thí nghiệm 3: Khảo sát đòn bẩy',
    grade: 8,
    topic: 'Cơ học và Máy cơ đơn giản',
    difficulty: 'Trung bình',
    curriculumRef: 'KHTN 8 - Tác dụng làm quay của lực, Đòn bẩy',
    icon: 'Scale',
    objectives: [
      'Nhận biết các bộ phận của đòn bẩy: điểm tựa O, các điểm tác dụng lực O1, O2 và cánh tay đòn l1, l2.',
      'Khảo sát điều kiện để một đòn bẩy nằm cân bằng nằm ngang.',
      'Kiểm chứng quy tắc mômen / điều kiện cân bằng lý tưởng của đòn bẩy: F1 × l1 = F2 × l2.'
    ],
    backgroundKnowledge: 'Đòn bẩy là một thanh cứng có thể quay quanh một trục cố định gọi là điểm tựa (O). Lực tác dụng F1 có cánh tay đòn l1 (khoảng cách từ điểm tựa đến giá của lực F1), lực F2 có cánh tay đòn l2. Khi đòn bẩy cân bằng nằm ngang thì tích của lực và cánh tay đòn ở hai phía bằng nhau: F1 × l1 = F2 × l2.',
    equipment: [
      'Thanh đòn bẩy có trục quay ở chính giữa và các lỗ treo cách đều (mỗi khoảng 2 cm hoặc 5 cm)',
      'Giá đỡ thí nghiệm chắc chắn',
      'Hộp quả nặng gia trọng chuẩn (mỗi quả 50 g tương ứng trọng lượng xấp xỉ 0.5 N)',
      'Thước đo milimét'
    ],
    safetyNotes: [
      'Treo các quả nặng nhẹ nhàng vào các móc treo, tránh làm cong thanh đòn bẩy.',
      'Trước khi đo, chỉnh ốc cân bằng ở hai đầu thanh để thanh nằm ngang thăng bằng tự do khi chưa treo tải.'
    ],
    drivingQuestion: 'Tại sao người thợ sửa xe dùng cờ-lê có cán dài lại mở được ốc chặt dễ dàng hơn? Có cách nào nâng một tảng đá nặng 100 kg bằng một lực chỉ 20 kg không?',
    hypothesisPrompt: 'Dự đoán: Muốn nâng một vật nặng gấp đôi (F2 = 2 × F1) thì cánh tay đòn l1 của người nâng phải dài hơn hay ngắn hơn cánh tay đòn l2 của vật?',
    steps: [
      {
        step: 1,
        title: 'Chỉnh thăng bằng ban đầu',
        description: 'Lắp thanh đòn bẩy lên giá thí nghiệm. Chỉnh ốc hai đầu sao cho thanh nằm ngang thăng bằng tự do.',
        tip: 'Kiểm tra điểm tựa quay không bị ma sát quá lớn.'
      },
      {
        step: 2,
        title: 'Bố trí tải trọng bên trái',
        description: 'Treo quả nặng F1 = 1.0 N (2 quả nặng 50g) ở vị trí cách điểm tựa l1 = 10 cm. Thanh sẽ nghiêng về bên trái.',
        tip: 'Xác định chính xác khoảng cách l1 từ móc treo đến trục quay O.'
      },
      {
        step: 3,
        title: 'Tìm vị trí cân bằng bên phải',
        description: 'Dùng quả nặng F2 = 0.5 N (1 quả) hoặc F2 = 2.0 N móc sang phía bên phải, dịch chuyển dọc thanh cho tới khi thanh nằm ngang trở lại. Ghi nhận l2.',
        tip: 'Khi thanh nằm ngang song song mặt bàn là đạt trạng thái cân bằng.'
      }
    ],
    measurementFields: [
      { key: 'force_1', label: 'Lực bên trái F1', unit: 'N', type: 'number', step: 0.1, min: 0.1 },
      { key: 'arm_1', label: 'Cánh tay đòn l1', unit: 'cm', type: 'number', step: 1, min: 1 },
      { key: 'force_2', label: 'Lực bên phải F2', unit: 'N', type: 'number', step: 0.1, min: 0.1 },
      { key: 'arm_2', label: 'Cánh tay đòn l2', unit: 'cm', type: 'number', step: 1, min: 1 }
    ],
    calculatedFormula: {
      targetKey: 'torque_ratio',
      label: 'Độ lệch tích lực (F1×l1 - F2×l2)',
      unit: 'N.cm',
      formulaDesc: '|F1×l1 - F2×l2| (Lý tưởng = 0)',
      calculate: (row) => {
        const F1 = Number(row.force_1);
        const l1 = Number(row.arm_1);
        const F2 = Number(row.force_2);
        const l2 = Number(row.arm_2);
        if (F1 > 0 && l1 > 0 && F2 > 0 && l2 > 0) {
          return Number((Math.abs(F1 * l1 - F2 * l2)).toFixed(2));
        }
        return null;
      }
    },
    sampleData: [
      { trial: 1, force_1: 1.0, arm_1: 10, force_2: 0.5, arm_2: 20 },
      { trial: 2, force_1: 2.0, arm_1: 6, force_2: 1.0, arm_2: 12 },
      { trial: 3, force_1: 1.5, arm_1: 8, force_2: 2.0, arm_2: 6 }
    ],
    applicationQuestions: [
      'Hãy chỉ ra điểm tựa, điểm tác dụng của lực nâng và điểm đặt của vật nặng ở chiếc kéo cắt kim loại và chiếc kéo cắt giấy.',
      'Nếu muốn nâng một tảng đá có trọng lượng 600 N bằng lực 150 N thì tỉ số giữa hai cánh tay đòn l1/l2 tối thiểu phải bằng bao nhiêu?',
      'Khi chơi bập bênh, một bạn nặng 40 kg muốn bập bênh cân bằng với một bạn nặng 20 kg thì bạn nặng 40 kg phải ngồi ở vị trí nào so với trục quay?'
    ],
    allowMediaUpload: true
  },
  {
    id: 'exp-temperature-change',
    title: 'Thí nghiệm 4: Khảo sát sự thay đổi nhiệt độ',
    grade: 6,
    topic: 'Nhiệt học và Năng lượng',
    difficulty: 'Cơ bản',
    curriculumRef: 'KHTN 6 / 8 - Năng lượng nhiệt, Sự truyền nhiệt và Đo nhiệt độ',
    icon: 'Thermometer',
    objectives: [
      'Biết sử dụng nhiệt kế điện tử hoặc nhiệt kế thủy ngân an toàn để đo nhiệt độ nước.',
      'Ghi nhận sự thay đổi nhiệt độ của nước ấm khi tỏa nhiệt ra môi trường không khí theo thời gian.',
      'Vẽ đồ thị nhiệt độ - thời gian và nhận xét về tốc độ giảm nhiệt độ (giảm nhanh lúc đầu, chậm dần khi gần bằng nhiệt độ phòng).'
    ],
    backgroundKnowledge: 'Nhiệt năng tự truyền từ vật có nhiệt độ cao hơn sang vật có nhiệt độ thấp hơn cho đến khi đạt cân bằng nhiệt. Tốc độ truyền nhiệt phụ thuộc vào độ chênh lệch nhiệt độ giữa hai vật: chênh lệch càng lớn thì truyền nhiệt càng nhanh.',
    equipment: [
      'Cốc thủy tinh chịu nhiệt chứa 150 ml nước ấm (khoảng 50°C - 60°C, nhiệt độ an toàn cho học sinh)',
      'Nhiệt kế có chia độ 0°C đến 100°C',
      'Đồng hồ bấm giây',
      'Nhiệt kế phòng đo nhiệt độ môi trường xung quanh'
    ],
    safetyNotes: [
      'Sử dụng nước ấm không quá 60°C để đảm bảo an toàn tuyệt đối, tránh gây bỏng.',
      'Cầm nhiệt kế nhẹ nhàng, không để bầu nhiệt kế chạm đáy hoặc thành cốc khi đọc số đo.'
    ],
    drivingQuestion: 'Một cốc nước nóng để trong phòng sẽ nguội đi theo quy luật nào? Tốc độ giảm nhiệt độ ở 5 phút đầu tiên có bằng tốc độ giảm ở 5 phút sau không?',
    hypothesisPrompt: 'Dự đoán: Sau mỗi 2 phút, nhiệt độ cốc nước sẽ giảm một lượng như nhau (tuyến tính) hay lượng giảm sẽ nhỏ dần khi nước nguội bớt?',
    steps: [
      {
        step: 1,
        title: 'Đo nhiệt độ phòng',
        description: 'Đo và ghi lại nhiệt độ môi trường xung quanh T_phong (thường khoảng 25°C - 30°C).',
        tip: 'Ghi lại để làm mốc đối chứng khi phân tích hiện tượng cân bằng nhiệt.'
      },
      {
        step: 2,
        title: 'Chuẩn bị cốc nước ấm',
        description: 'Rót khoảng 150 ml nước ấm vào cốc. Cắm nhiệt kế vào giữa khối nước.',
        tip: 'Chờ cột chất lỏng trong nhiệt kế dâng lên ổn định trước khi bấm thời gian.'
      },
      {
        step: 3,
        title: 'Ghi nhiệt độ mỗi phút',
        description: 'Bắt đầu bấm giờ (t = 0 min, ghi T0). Sau mỗi 1 phút (1, 2, 3, 4, 5, 6 phút), đọc và ghi lại số chỉ nhiệt độ T.',
        tip: 'Mắt nhìn ngang bằng với đỉnh cột chất lỏng trong nhiệt kế.'
      }
    ],
    measurementFields: [
      { key: 'time_min', label: 'Thời gian (t)', unit: 'phút', type: 'number', step: 1, min: 0 },
      { key: 'temp_c', label: 'Nhiệt độ (T)', unit: '°C', type: 'number', step: 0.5, min: 0 }
    ],
    calculatedFormula: {
      targetKey: 'temp_drop',
      label: 'Độ giảm so với nhiệt độ ban đầu ΔT',
      unit: '°C',
      formulaDesc: 'T0 - T (với T0 là nhiệt độ ở t = 0 min)',
      calculate: (row) => {
        const t = Number(row.temp_c);
        return !isNaN(t) ? t : null;
      }
    },
    sampleData: [
      { trial: 1, time_min: 0, temp_c: 60.0 },
      { trial: 2, time_min: 1, temp_c: 56.5 },
      { trial: 3, time_min: 2, temp_c: 53.5 },
      { trial: 4, time_min: 3, temp_c: 51.0 },
      { trial: 5, time_min: 4, temp_c: 49.0 },
      { trial: 6, time_min: 5, temp_c: 47.5 }
    ],
    applicationQuestions: [
      'Tại sao khi muốn giữ nước nóng lâu, người ta lại dùng phích nước (bình thủy) có cấu tạo vỏ hai lớp chân không và tráng bạc?',
      'Dựa vào đồ thị thu được, hãy giải thích vì sao nước nguội nhanh lúc mới rót ra và nguội chậm dần về sau?',
      'Nếu em khuấy nhẹ nước trong cốc hoặc thổi quạt vào cốc thì tốc độ nguội của nước sẽ tăng hay giảm? Giải thích bằng kiến thức truyền nhiệt.'
    ],
    allowMediaUpload: true
  },
  {
    id: 'exp-simple-circuit',
    title: 'Thí nghiệm 5: Khám phá mạch điện đơn giản',
    grade: 8,
    topic: 'Điện học',
    difficulty: 'Cơ bản',
    curriculumRef: 'KHTN 8 - Mạch điện đơn giản, Dòng điện và Tác dụng của dòng điện',
    icon: 'Zap',
    objectives: [
      'Lắp ráp được mạch điện đơn giản gồm: nguồn điện một chiều (pin), bóng đèn LED hoặc đèn sợi đốt nhỏ, công tắc và dây nối.',
      'Phân biệt được trạng thái mạch kín (đèn sáng, có dòng điện chạy qua) và mạch hở (đèn tắt).',
      'Quan sát độ sáng của bóng đèn khi thay đổi số lượng pin (mắc nối tiếp) hoặc khi mắc thêm điện trở.'
    ],
    backgroundKnowledge: 'Dòng điện là dòng chuyển dời có hướng của các hạt mang điện. Một mạch điện kín cơ bản gồm nguồn điện (cung cấp năng lượng điện), phụ tải tiêu thụ điện (bóng đèn), dây dẫn (truyền điện) và thiết bị đóng ngắt (công tắc). Tuyệt đối chỉ thí nghiệm với pin điện áp thấp (1.5V - 6V), không chạm vào nguồn điện lưới sinh hoạt 220V.',
    equipment: [
      'Hộp đế pin chứa 1 đến 3 viên pin AA (1.5V / viên, tổng điện áp an toàn 1.5V - 4.5V)',
      'Bóng đèn LED đỏ/vàng kèm điện trở bảo vệ 220Ω (hoặc bóng đèn pin 3V)',
      'Công tắc đơn (công tắc gạt hoặc nút bấm)',
      'Bộ 4 dây nối có kẹp cá sấu hai đầu',
      'Đồng hồ vạn năng hoặc Vôn kế đo điện áp'
    ],
    safetyNotes: [
      'CHỈ ĐƯỢC DÙNG NGUỒN PIN 1.5V - 4.5V. TUYỆT ĐỐI KHÔNG cắm vào ổ cắm điện lưới trong lớp học.',
      'Không nối trực tiếp hai cực của pin với nhau bằng dây dẫn (tránh hiện tượng đoản mạch gây nóng và hỏng pin).'
    ],
    drivingQuestion: 'Điều kiện nào để bóng đèn trong mạch điện có thể phát sáng? Nếu lắp ngược cực của pin đối với đèn LED thì đèn có sáng không?',
    hypothesisPrompt: 'Dự đoán: Khi đóng công tắc thì mạch trở thành mạch kín hay hở? Khi tăng từ 1 pin (1.5V) lên 2 pin (3.0V) thì độ sáng của bóng đèn sẽ như thế nào?',
    steps: [
      {
        step: 1,
        title: 'Kiểm tra linh kiện',
        description: 'Quan sát các chốt cắm của hộp pin, chân dài (+) và chân ngắn (-) của đèn LED, công tắc ở vị trí MỞ.',
        tip: 'Đèn LED là linh kiện bán dẫn chỉ cho dòng điện chạy qua theo một chiều từ anot (+) sang catot (-).'
      },
      {
        step: 2,
        title: 'Mắc mạch điện nối tiếp',
        description: 'Nối cực (+) của pin với một đầu công tắc. Đầu còn lại của công tắc nối với chân dài LED. Chân ngắn LED nối về cực (-) của pin.',
        tip: 'Giữ công tắc mở khi đang thao tác cắm dây.'
      },
      {
        step: 3,
        title: 'Đóng công tắc và ghi nhận',
        description: 'Gạt công tắc sang vị trí ĐÓNG. Quan sát hiện tượng đèn sáng. Thử nghiệm với 1 pin, 2 pin và đo điện áp hai đầu đèn.',
        tip: 'Ghi lại trạng thái đèn (Sáng yếu / Sáng rõ / Sáng mạnh).'
      }
    ],
    measurementFields: [
      { key: 'battery_count', label: 'Số lượng pin (1.5V/viên)', unit: 'viên', type: 'number', step: 1, min: 1 },
      { key: 'voltage_v', label: 'Điện áp đo được (U)', unit: 'V', type: 'number', step: 0.1, min: 0 },
      { key: 'current_ma', label: 'Cường độ dòng điện (I)', unit: 'mA', type: 'number', step: 1, min: 0 }
    ],
    calculatedFormula: {
      targetKey: 'power_mw',
      label: 'Công suất tiêu thụ P = U × I',
      unit: 'mW',
      formulaDesc: 'P = U (V) × I (mA)',
      calculate: (row) => {
        const u = Number(row.voltage_v);
        const i = Number(row.current_ma);
        if (u > 0 && i >= 0) {
          return Number((u * i).toFixed(1));
        }
        return null;
      }
    },
    sampleData: [
      { trial: 1, battery_count: 1, voltage_v: 1.45, current_ma: 12 },
      { trial: 2, battery_count: 2, voltage_v: 2.90, current_ma: 25 },
      { trial: 3, battery_count: 3, voltage_v: 4.35, current_ma: 38 }
    ],
    applicationQuestions: [
      'Tại sao các thiết bị điện trong gia đình (quạt, đèn, tivi) lại được mắc song song chứ không mắc nối tiếp?',
      'Cầu chì hoặc cầu dao tự động (Aptomat) trong mạch điện có tác dụng gì khi xảy ra sự cố chập mạch?',
      'Nếu trong mạch kín có một bóng đèn bị đứt dây tóc thì các bóng đèn khác mắc nối tiếp có còn sáng không? Vì sao?'
    ],
    allowMediaUpload: true
  },
  {
    id: 'exp-pendulum-oscillation',
    title: 'Thí nghiệm 6: Khảo sát dao động con lắc đơn',
    grade: 8,
    topic: 'Chuyển động tuần hoàn và Sóng âm',
    difficulty: 'Trung bình',
    curriculumRef: 'KHTN 8 / 9 - Dao động, Tần số và Chu kì dao động',
    icon: 'Activity',
    objectives: [
      'Hiểu khái niệm một dao động toàn phần và chu kì dao động T (thời gian thực hiện một dao động toàn phần: T = t / N).',
      'Đo thời gian t của N = 10 hoặc 20 dao động toàn phần để giảm thiểu sai số bấm đồng hồ.',
      'Khảo sát ảnh hưởng của chiều dài dây treo l đến chu kì dao động T của con lắc đơn.'
    ],
    backgroundKnowledge: 'Con lắc đơn gồm một vật nặng có kích thước nhỏ được treo vào đầu một sợi dây mảnh, không dãn có chiều dài l. Khi kéo vật lệch khỏi vị trí cân bằng một góc nhỏ rồi thả tay, con lắc sẽ dao động qua lại quanh vị trí cân bằng. Chu kì dao động T là thời gian vật thực hiện đúng 1 dao động toàn phần: T = t / N.',
    equipment: [
      'Sợi dây chỉ mềm, mảnh không dãn (dài khoảng 1 mét)',
      'Quả nặng kim loại nhỏ (khối lượng khoảng 20g - 50g)',
      'Giá thí nghiệm thẳng đứng có móc kẹp giữ dây',
      'Thước thẳng chia milimét',
      'Đồng hồ bấm giây'
    ],
    safetyNotes: [
      'Chỉ kéo con lắc lệch một góc nhỏ (dưới 10 độ) để đảm bảo dao động điều hòa gần đúng.',
      'Kẹp chặt đầu dây treo ở giá đỡ, không để dây bị tuột trong lúc con lắc đang dao động.'
    ],
    drivingQuestion: 'Thời gian một chiếc đồng hồ quả lắc đung đưa một nhịp phụ thuộc vào độ dài của con lắc hay phụ thuộc vào quả nặng nặng hay nhẹ?',
    hypothesisPrompt: 'Dự đoán: Khi chiều dài dây treo dài gấp 4 lần thì chu kì dao động T của con lắc sẽ tăng lên gấp bao nhiêu lần?',
    steps: [
      {
        step: 1,
        title: 'Cài đặt chiều dài dây l1 = 25 cm',
        description: 'Đo chính xác khoảng cách từ điểm treo đến tâm quả nặng là l1 = 25 cm (0.25 m).',
        tip: 'Đo chiều dài đến đúng tâm của quả nặng kim loại.'
      },
      {
        step: 2,
        title: 'Kéo lệch góc nhỏ và thả nhẹ',
        description: 'Kéo quả nặng lệch khỏi vị trí cân bằng một góc khoảng 5° - 8° rồi thả tay nhẹ nhàng (không đẩy).',
        tip: 'Đợi con lắc dao động ổn định trong 1-2 nhịp trước khi bắt đầu bấm giờ.'
      },
      {
        step: 3,
        title: 'Đo thời gian của N = 10 dao động',
        description: 'Khi quả nặng qua vị trí biên (hoặc vị trí cân bằng theo cùng một chiều), bắt đầu đếm 0, 1, 2... đến 10 dao động thì bấm dừng. Ghi lại tổng thời gian t.',
        tip: 'Đo 10 dao động rồi chia 10 sẽ giảm sai số bấm tay xuống 10 lần.'
      },
      {
        step: 4,
        title: 'Khảo sát với l2 = 50 cm và l3 = 100 cm',
        description: 'Thay đổi chiều dài dây lên l2 = 50 cm, sau đó l3 = 100 cm. Lặp lại thao tác đo N = 10 dao động.',
        tip: 'So sánh tỉ số chu kì với căn bậc hai của tỉ số chiều dài.'
      }
    ],
    measurementFields: [
      { key: 'length_cm', label: 'Chiều dài dây l', unit: 'cm', type: 'number', step: 1, min: 10 },
      { key: 'oscillations_count', label: 'Số dao động (N)', unit: 'dao động', type: 'number', step: 1, min: 5 },
      { key: 'total_time_s', label: 'Tổng thời gian (t)', unit: 's', type: 'number', step: 0.05, min: 1 }
    ],
    calculatedFormula: {
      targetKey: 'period_t',
      label: 'Chu kì T = t / N',
      unit: 's',
      formulaDesc: 'T = t / N',
      calculate: (row) => {
        const t = Number(row.total_time_s);
        const N = Number(row.oscillations_count);
        if (t > 0 && N > 0) {
          return Number((t / N).toFixed(3));
        }
        return null;
      }
    },
    sampleData: [
      { trial: 1, length_cm: 25, oscillations_count: 10, total_time_s: 10.05 },
      { trial: 2, length_cm: 50, oscillations_count: 10, total_time_s: 14.20 },
      { trial: 3, length_cm: 100, oscillations_count: 10, total_time_s: 20.10 }
    ],
    applicationQuestions: [
      'Tại sao vào mùa hè đồng hồ quả lắc thường chạy chậm lại một chút so với mùa đông nếu không được hiệu chỉnh?',
      'Nếu muốn tăng chu kì dao động của con lắc đơn lên gấp đôi thì ta cần điều chỉnh chiều dài dây treo tăng lên mấy lần?',
      'Theo em, quả nặng nặng hơn hay nhẹ hơn có làm thay đổi chu kì dao động của con lắc đơn khi góc lệch nhỏ không?'
    ],
    allowMediaUpload: true
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // CHỦ ĐỀ 1: TỐC ĐỘ VÀ CHUYỂN ĐỘNG (10 câu)
  {
    id: 'q-speed-01',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Nhận biết',
    question: 'Công thức nào sau đây được dùng để tính tốc độ chuyển động của một vật?',
    options: ['v = s × t', 'v = s / t', 'v = t / s', 'v = s + t'],
    correctAnswer: 1,
    explanation: 'Tốc độ v bằng quãng đường đi được s chia cho khoảng thời gian t để đi hết quãng đường đó: v = s / t.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-02',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Nhận biết',
    question: 'Đơn vị đo tốc độ hợp pháp trong hệ đo lường quốc tế (SI) là gì?',
    options: ['km/h (kilômét trên giờ)', 'm/s (mét trên giây)', 'cm/s (xentimét trên giây)', 'm/phút (mét trên phút)'],
    correctAnswer: 1,
    explanation: 'Trong hệ SI, đơn vị đo độ dài là mét (m), đơn vị đo thời gian là giây (s), do đó đơn vị chuẩn của tốc độ là m/s.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-03',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Thông hiểu',
    question: 'Đổi tốc độ 36 km/h sang đơn vị m/s, ta được kết quả là:',
    options: ['10 m/s', '100 m/s', '3,6 m/s', '12,96 m/s'],
    correctAnswer: 0,
    explanation: '36 km/h = 36 × (1000 m / 3600 s) = 36 / 3.6 = 10 m/s.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-04',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Thông hiểu',
    question: 'Một xe đồ chơi đi được quãng đường 2 m trong thời gian 4 giây. Tốc độ của xe là:',
    options: ['8 m/s', '2 m/s', '0,5 m/s', '0,25 m/s'],
    correctAnswer: 2,
    explanation: 'v = s / t = 2 m / 4 s = 0,5 m/s.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-05',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Vận dụng',
    question: 'Một vận động viên bơi lội bơi được quãng đường 100 m với tốc độ trung bình 2 m/s. Thời gian bơi của vận động viên là:',
    options: ['200 giây', '50 giây', '25 giây', '0,02 giây'],
    correctAnswer: 1,
    explanation: 'Áp dụng công thức: t = s / v = 100 m / 2 m/s = 50 s.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-06',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Vận dụng',
    question: 'Khi đo tốc độ xe đồ chơi, nếu học sinh bấm đồng hồ dừng trễ hơn so với lúc xe chạm đích thì tốc độ tính được sẽ:',
    options: ['Lớn hơn tốc độ thực tế', 'Nhỏ hơn tốc độ thực tế', 'Bằng tốc độ thực tế', 'Bằng không'],
    correctAnswer: 1,
    explanation: 'Khi bấm dừng trễ, thời gian đo được t sẽ lớn hơn thực tế. Vì v = s / t, mẫu số t tăng làm tốc độ v tính được bị giảm nhỏ hơn thực tế.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-07',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Vận dụng cao',
    question: 'Hai bạn cùng chạy 100m. Bạn A chạy với tốc độ 5 m/s. Bạn B chạy mất 18 giây. Bạn nào về đích trước?',
    options: ['Bạn A về trước', 'Bạn B về trước', 'Hai bạn về cùng lúc', 'Không thể xác định'],
    correctAnswer: 1,
    explanation: 'Thời gian của bạn A: t_A = 100 / 5 = 20 s. Thời gian bạn B là 18 s. Vì t_B < t_A nên bạn B chạy nhanh hơn và về đích trước.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-08',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Nhận biết',
    question: 'Dụng cụ nào sau đây thường dùng để đo trực tiếp tốc độ của phương tiện giao thông trên đường?',
    options: ['Lực kế', 'Súng bắn tốc độ (máy đo tốc độ)', 'Nhiệt kế', 'Ampe kế'],
    correctAnswer: 1,
    explanation: 'Cảnh sát giao thông sử dụng máy bắn tốc độ (radar hoặc laser) để đo tức thời tốc độ của các xe lưu thông.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-09',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Thông hiểu',
    question: 'Trên đồ thị quãng đường - thời gian (s - t), một đoạn đồ thị nằm ngang song song trục thời gian biểu diễn trạng thái nào?',
    options: ['Vật chuyển động nhanh dần', 'Vật chuyển động đều', 'Vật đang đứng yên', 'Vật chuyển động chậm dần'],
    correctAnswer: 2,
    explanation: 'Đoạn nằm ngang biểu thị thời gian t trôi qua nhưng quãng đường s không thay đổi, nghĩa là vật đang đứng yên.',
    relatedExperimentId: 'exp-speed-measurement'
  },
  {
    id: 'q-speed-10',
    topic: 'Tốc độ và Chuyển động',
    grade: 7,
    level: 'Vận dụng cao',
    question: 'Một xe chạy nửa quãng đường đầu với tốc độ 40 km/h và nửa quãng đường sau với tốc độ 60 km/h. Tốc độ trung bình trên cả quãng đường là:',
    options: ['50 km/h', '48 km/h', '52 km/h', '45 km/h'],
    correctAnswer: 1,
    explanation: 'v_tb = s / (t1 + t2) = s / ( (s/2)/40 + (s/2)/60 ) = 2 / (1/40 + 1/60) = 2 / (5/120) = 48 km/h (không phải trung bình cộng đơn thuần).',
    relatedExperimentId: 'exp-speed-measurement'
  },

  // CHỦ ĐỀ 2: ÁNH SÁNG VÀ PHẢN XẠ (10 câu)
  {
    id: 'q-light-01',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Nhận biết',
    question: 'Theo định luật phản xạ ánh sáng, góc phản xạ i\' có mối quan hệ như thế nào với góc tới i?',
    options: ['i\' > i', 'i\' < i', 'i\' = i', 'i\' = 2 × i'],
    correctAnswer: 2,
    explanation: 'Định luật phản xạ ánh sáng phát biểu: Góc phản xạ luôn bằng góc tới: i\' = i.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-02',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Nhận biết',
    question: 'Pháp tuyến của gương tại điểm tới là đường thẳng như thế nào so với mặt phẳng gương?',
    options: ['Song song với mặt gương', 'Vuông góc với mặt gương', 'Hợp với mặt gương góc 45°', 'Nằm trùng với mặt gương'],
    correctAnswer: 1,
    explanation: 'Pháp tuyến tại điểm tới luôn vuông góc (90 độ) với bề mặt phản xạ của gương tại điểm đó.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-03',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Thông hiểu',
    question: 'Chiếu một tia sáng tới mặt gương phẳng với góc tới i = 35°. Góc phản xạ i\' đo được sẽ bằng bao nhiêu độ?',
    options: ['35°', '55°', '70°', '0°'],
    correctAnswer: 0,
    explanation: 'Vì i\' = i nên khi i = 35° thì góc phản xạ i\' cũng bằng 35°.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-04',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Thông hiểu',
    question: 'Chiếu tia sáng tới hợp với mặt gương một góc 30°. Góc tới i bằng bao nhiêu độ?',
    options: ['30°', '60°', '90°', '120°'],
    correctAnswer: 1,
    explanation: 'Góc tới i là góc giữa tia tới và pháp tuyến. Vì pháp tuyến vuông góc gương (90°) nên góc tới i = 90° - 30° = 60°.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-05',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Vận dụng',
    question: 'Nếu góc tới i = 40° thì góc hợp bởi tia tới và tia phản xạ là:',
    options: ['40°', '80°', '90°', '140°'],
    correctAnswer: 1,
    explanation: 'Góc giữa tia tới và tia phản xạ là: i + i\' = 40° + 40° = 80°.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-06',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Vận dụng',
    question: 'Khi chiếu tia sáng vuông góc với mặt gương phẳng (góc tới i = 0°), tia phản xạ sẽ:',
    options: ['Bị khúc xạ đi thẳng qua gương', 'Bật ngược trở lại theo phương cũ trùng tia tới', 'Lệch một góc 90°', 'Biến mất'],
    correctAnswer: 1,
    explanation: 'Khi i = 0°, góc phản xạ i\' = 0°, tia phản xạ trùng với pháp tuyến và đi ngược chiều với tia tới.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-07',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Nhận biết',
    question: 'Ảnh của một vật tạo bởi gương phẳng có tính chất gì sau đây?',
    options: ['Ảnh thật, ngược chiều với vật', 'Ảnh ảo, không hứng được trên màn chắn, lớn bằng vật', 'Ảnh thật, cùng chiều với vật', 'Ảnh ảo, nhỏ hơn vật'],
    correctAnswer: 1,
    explanation: 'Ảnh tạo bởi gương phẳng là ảnh ảo, không hứng được trên màn, có kích thước bằng vật và đối xứng với vật qua mặt gương.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-08',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Thông hiểu',
    question: 'Một học sinh đứng cách mặt gương phẳng 1,5 m. Khoảng cách từ học sinh đó đến ảnh của mình trong gương là:',
    options: ['1,5 m', '3,0 m', '0,75 m', '4,5 m'],
    correctAnswer: 1,
    explanation: 'Khoảng cách từ ảnh đến gương bằng khoảng cách từ vật đến gương (1,5 m). Khoảng cách từ người đến ảnh = 1,5 + 1,5 = 3,0 m.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-09',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Vận dụng cao',
    question: 'Muốn tia phản xạ vuông góc với tia tới thì góc tới i phải bằng bao nhiêu độ?',
    options: ['30°', '45°', '60°', '90°'],
    correctAnswer: 1,
    explanation: 'Góc giữa tia tới và tia phản xạ là i + i\' = 2i = 90° => i = 45°.',
    relatedExperimentId: 'exp-light-reflection'
  },
  {
    id: 'q-light-10',
    topic: 'Ánh sáng và Thị giác',
    grade: 7,
    level: 'Vận dụng cao',
    question: 'Khi xoay gương phẳng một góc α quanh trục nằm trên mặt gương thì tia phản xạ sẽ quay một góc bao nhiêu độ?',
    options: ['α', '2α', '0,5α', '4α'],
    correctAnswer: 1,
    explanation: 'Khi gương quay một góc α, pháp tuyến quay α làm góc tới thay đổi α, góc phản xạ cũng thay đổi α theo cùng chiều, kết quả tia phản xạ quay một góc 2α.',
    relatedExperimentId: 'exp-light-reflection'
  },

  // CHỦ ĐỀ 3: CƠ HỌC VÀ ĐÒN BẨY (10 câu)
  {
    id: 'q-lever-01',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Nhận biết',
    question: 'Điều kiện cân bằng lí tưởng của một đòn bẩy khi tác dụng lực F1, F2 có cánh tay đòn l1, l2 là:',
    options: ['F1 / l1 = F2 / l2', 'F1 × l1 = F2 × l2', 'F1 + l1 = F2 + l2', 'F1 - l1 = F2 - l2'],
    correctAnswer: 1,
    explanation: 'Quy tắc mômen đối với đòn bẩy: Tích của lực và cánh tay đòn ở hai phía điểm tựa bằng nhau: F1 × l1 = F2 × l2.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-02',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Nhận biết',
    question: 'Điểm tựa của đòn bẩy là điểm:',
    options: ['Cố định mà đòn bẩy có thể quay quanh nó', 'Đặt lực tác dụng của người', 'Treo vật nặng cần nâng', 'Chính giữa của thanh bất kì'],
    correctAnswer: 0,
    explanation: 'Điểm tựa (kí hiệu O) là điểm cố định mà thanh đòn bẩy tựa vào và có thể quay quanh nó.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-03',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Để nâng một vật nặng mà được lợi về lực (lực nâng F1 nhỏ hơn trọng lượng vật F2), ta cần chọn cánh tay đòn như thế nào?',
    options: ['l1 < l2', 'l1 > l2', 'l1 = l2', 'Không liên quan đến l1, l2'],
    correctAnswer: 1,
    explanation: 'Vì F1 × l1 = F2 × l2 nên khi l1 > l2 thì F1 < F2, nghĩa là ta bỏ ra lực nhỏ hơn trọng lượng vật.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-04',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Dụng cụ nào sau đây là ứng dụng của đòn bẩy cho ta lợi về lực?',
    options: ['Kìm cắt kim loại', 'Cần câu cá', 'Kẹp gắp than', 'Mái chèo thuyền'],
    correctAnswer: 0,
    explanation: 'Kìm cắt kim loại có cán dài (l1 lớn) và lưỡi kìm ngắn (l2 nhỏ), giúp tạo lực cắt rất mạnh ở lưỡi.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-05',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Vận dụng',
    question: 'Treo vật F1 = 4 N cách điểm tựa l1 = 15 cm. Muốn đòn bẩy cân bằng, một lực F2 = 6 N phải đặt cách điểm tựa bao nhiêu cm?',
    options: ['10 cm', '20 cm', '22,5 cm', '15 cm'],
    correctAnswer: 0,
    explanation: 'Áp dụng F1 × l1 = F2 × l2 => 4 × 15 = 6 × l2 => 60 = 6 × l2 => l2 = 10 cm.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-06',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Vận dụng',
    question: 'Một người thợ dùng đòn bẩy dài 1,2 m để bẩy một tảng đá. Điểm tựa cách tảng đá 0,2 m. Lực tác dụng của người đó được lợi bao nhiêu lần?',
    options: ['6 lần', '5 lần', '2 lần', '4 lần'],
    correctAnswer: 1,
    explanation: 'Cánh tay đòn của đá l2 = 0,2 m. Cánh tay đòn của người l1 = 1,2 - 0,2 = 1,0 m. Tỉ số l1 / l2 = 1,0 / 0,2 = 5 lần, do đó lực nâng giảm 5 lần.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-07',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Nhận biết',
    question: 'Ở chiếc kéo cắt giấy gia đình, lưỡi kéo dài hơn tay cầm có mục đích gì?',
    options: ['Để cắt nhanh và đường cắt dài (thiệt về lực, lợi về đường đi)', 'Để được lợi về lực', 'Để cầm cho chắc tay', 'Để lưỡi kéo không bị cùn'],
    correctAnswer: 0,
    explanation: 'Giấy là vật liệu mềm không cần lực lớn, kéo cắt giấy có lưỡi dài để tạo đường cắt dài và nhanh chóng.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-08',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Cánh tay đòn của một lực là khoảng cách:',
    options: ['Từ điểm tựa đến giá của lực', 'Từ điểm đặt lực đến điểm tựa', 'Dọc theo chiều dài của đòn bẩy', 'Từ điểm tựa đến trung điểm của đòn bẩy'],
    correctAnswer: 0,
    explanation: 'Định nghĩa chính xác: Cánh tay đòn là khoảng cách vuông góc từ trục quay (điểm tựa) đến giá của lực.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-09',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Vận dụng cao',
    question: 'Một thanh đòn bẩy đồng chất có khối lượng m = 2 kg, dài 1 m. Điểm tựa đặt cách đầu A một khoảng 0,3 m. Trọng lượng của thanh tác dụng tại đâu?',
    options: ['Tại đầu A', 'Tại đầu B', 'Tại trung điểm của thanh (cách A 0,5 m)', 'Tại điểm tựa'],
    correctAnswer: 2,
    explanation: 'Với thanh đồng chất tiết diện đều, trọng tâm của thanh nằm chính giữa thanh, tức cách đầu A một khoảng 0,5 m.',
    relatedExperimentId: 'exp-lever-balance'
  },
  {
    id: 'q-lever-10',
    topic: 'Cơ học và Đòn bẩy',
    grade: 8,
    level: 'Vận dụng cao',
    question: 'Hai bạn cùng khiêng một xô nước 30 kg bằng một cây gậy dài 1,5 m. Xô nước treo cách vai bạn A là 0,5 m. Vai bạn A phải chịu một lực bằng bao nhiêu?',
    options: ['100 N', '200 N', '150 N', '300 N'],
    correctAnswer: 1,
    explanation: 'Trọng lượng xô nước P = 300 N. Khoảng cách đến B là 1,0 m. Mômen quanh B: F_A × 1,5 = 300 × 1,0 => F_A = 200 N.',
    relatedExperimentId: 'exp-lever-balance'
  },

  // CHỦ ĐỀ 4: NHIỆT HỌC VÀ NĂNG LƯỢNG (10 câu)
  {
    id: 'q-heat-01',
    topic: 'Nhiệt học và Năng lượng',
    grade: 6,
    level: 'Nhận biết',
    question: 'Nhiệt độ của vật cho biết điều gì?',
    options: ['Khối lượng của vật', 'Mức độ nóng hay lạnh của vật', 'Thể tích của vật', 'Màu sắc của vật'],
    correctAnswer: 1,
    explanation: 'Nhiệt độ là số đo mức độ nóng hay lạnh của vật.',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-02',
    topic: 'Nhiệt học và Năng lượng',
    grade: 6,
    level: 'Nhận biết',
    question: 'Nhiệt năng tự truyền giữa hai vật khi nào?',
    options: ['Khi hai vật có khối lượng khác nhau', 'Khi hai vật có nhiệt độ chênh lệch nhau', 'Khi hai vật có thể tích khác nhau', 'Khi hai vật có hình dạng khác nhau'],
    correctAnswer: 1,
    explanation: 'Nhiệt năng tự truyền từ vật có nhiệt độ cao sang vật có nhiệt độ thấp hơn khi có sự chênh lệch nhiệt độ.',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-03',
    topic: 'Nhiệt học và Năng lượng',
    grade: 6,
    level: 'Thông hiểu',
    question: 'Khi thả một miếng đồng 80°C vào một cốc nước 25°C, quá trình truyền nhiệt sẽ dừng lại khi:',
    options: ['Nhiệt độ miếng đồng giảm về 25°C', 'Nhiệt độ hai vật bằng nhau (đạt cân bằng nhiệt)', 'Nhiệt năng miếng đồng bằng 0', 'Nước sôi ở 100°C'],
    correctAnswer: 1,
    explanation: 'Quá trình truyền nhiệt tiếp diễn cho đến khi nhiệt độ của hai vật cân bằng bằng nhau: T_dong = T_nuoc.',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-04',
    topic: 'Nhiệt học và Năng lượng',
    grade: 6,
    level: 'Thông hiểu',
    question: 'Tại sao khi đo nhiệt độ cơ thể bằng nhiệt kế y tế thủy ngân, người ta phải vẩy mạnh nhiệt kế trước khi đo?',
    options: ['Để làm sạch nhiệt kế', 'Để đưa cột thủy ngân tụt xuống dưới vạch 35°C', 'Để làm nóng thủy ngân', 'Để thủy ngân không bị đông đặc'],
    correctAnswer: 1,
    explanation: 'Ống quản của nhiệt kế y tế có chỗ thắt hẹp giữ thủy ngân không tự tụt xuống sau khi rút khỏi cơ thể, cần vẩy mạnh để thủy ngân tụt xuống bình chứa trước khi đo lại.',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-05',
    topic: 'Nhiệt học và Năng lượng',
    grade: 6,
    level: 'Vận dụng',
    question: 'Khi để một cốc nước sôi 100°C trong phòng 25°C, trong 3 phút đầu nước giảm từ 100°C xuống 85°C. Trong 3 phút tiếp theo, nhiệt độ nước sẽ:',
    options: ['Giảm thêm đúng 15°C nữa xuống 70°C', 'Giảm ít hơn 15°C (ví dụ xuống khoảng 73°C - 75°C)', 'Giảm nhiều hơn 15°C', 'Không giảm nữa'],
    correctAnswer: 1,
    explanation: 'Khi nhiệt độ nước giảm dần, độ chênh lệch nhiệt độ giữa nước và môi trường nhỏ đi nên tốc độ tỏa nhiệt chậm lại, do đó nhiệt độ giảm ít hơn trong cùng khoảng thời gian.',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-06',
    topic: 'Nhiệt học và Năng lượng',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Hiện tượng đối lưu là hình thức truyền nhiệt chủ yếu xảy ra trong môi trường nào?',
    options: ['Chất rắn', 'Chất lỏng và chất khí', 'Chân không', 'Kim loại'],
    correctAnswer: 1,
    explanation: 'Đối lưu là sự truyền nhiệt bằng các dòng chất lỏng hoặc chất khí di chuyển do sự chênh lệch khối lượng riêng.',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-07',
    topic: 'Nhiệt học và Năng lượng',
    grade: 8,
    level: 'Vận dụng',
    question: 'Tại sao xoong, nồi nấu ăn thường làm bằng kim loại nhôm, inox còn tay cầm lại làm bằng gỗ hoặc nhựa cách nhiệt?',
    options: ['Kim loại dẫn nhiệt tốt giúp thức ăn nhanh chín, gỗ/nhựa dẫn nhiệt kém tránh gây bỏng', 'Kim loại rẻ hơn nhựa', 'Gỗ/nhựa bền với nhiệt hơn kim loại', 'Để nồi trông đẹp mắt hơn'],
    correctAnswer: 0,
    explanation: 'Kim loại dẫn nhiệt tốt để truyền nhiệt từ bếp vào thức ăn; tay cầm bằng chất dẫn nhiệt kém bảo vệ tay người nấu không bị bỏng.',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-08',
    topic: 'Nhiệt học và Năng lượng',
    grade: 8,
    level: 'Nhận biết',
    question: 'Đơn vị đo nhiệt lượng trong hệ SI là gì?',
    options: ['Calo (cal)', 'Jun (J)', 'Oát (W)', 'Độ C (°C)'],
    correctAnswer: 1,
    explanation: 'Trong hệ SI, đơn vị của năng lượng và nhiệt lượng là Jun (J).',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-09',
    topic: 'Nhiệt học và Năng lượng',
    grade: 8,
    level: 'Vận dụng cao',
    question: 'Pha 100g nước ở 20°C với 100g nước ở 80°C. Bỏ qua nhiệt lượng hao phí ra cốc và môi trường, nhiệt độ cân bằng là:',
    options: ['50°C', '60°C', '40°C', '100°C'],
    correctAnswer: 0,
    explanation: 'Vì hai khối lượng nước bằng nhau và cùng chất (nhiệt dung riêng c như nhau): m1 × c × (t_cb - 20) = m2 × c × (80 - t_cb) => t_cb = (20 + 80) / 2 = 50°C.',
    relatedExperimentId: 'exp-temperature-change'
  },
  {
    id: 'q-heat-10',
    topic: 'Nhiệt học và Năng lượng',
    grade: 8,
    level: 'Vận dụng cao',
    question: 'Bình giữ nhiệt chất lượng cao có lớp vỏ kép hút chân không nhằm mục đích gì?',
    options: ['Ngăn cản sự truyền nhiệt bằng dẫn nhiệt và đối lưu', 'Để bình nhẹ hơn', 'Để nước bên trong không bị rò rỉ', 'Để chịu lực va đập tốt hơn'],
    correctAnswer: 0,
    explanation: 'Chân không không chứa các hạt vật chất nên không thể xảy ra hiện tượng dẫn nhiệt và đối lưu, giúp giữ nhiệt cực tốt.',
    relatedExperimentId: 'exp-temperature-change'
  },

  // CHỦ ĐỀ 5: ĐIỆN HỌC VÀ MẠCH ĐIỆN (10 câu)
  {
    id: 'q-electric-01',
    topic: 'Điện học',
    grade: 8,
    level: 'Nhận biết',
    question: 'Dòng điện là gì?',
    options: ['Dòng chuyển dời hỗn loạn của các phân tử', 'Dòng chuyển dời có hướng của các hạt mang điện', 'Dòng các nguyên tử đứng yên', 'Ánh sáng phát ra từ bóng đèn'],
    correctAnswer: 1,
    explanation: 'Dòng điện là dòng các hạt mang điện (như êlectron tự do trong kim loại) chuyển dời có hướng.',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-02',
    topic: 'Điện học',
    grade: 8,
    level: 'Nhận biết',
    question: 'Đơn vị đo cường độ dòng điện là gì và dụng cụ nào dùng để đo?',
    options: ['Vôn (V), Vôn kế', 'Ampe (A), Ampe kế', 'Oát (W), Oát kế', 'Ôm (Ω), Ôm kế'],
    correctAnswer: 1,
    explanation: 'Cường độ dòng điện có đơn vị là Ampe (A), được đo bằng Ampe kế mắc nối tiếp trong mạch.',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-03',
    topic: 'Điện học',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Khi lắp đèn LED vào nguồn pin 3V, chân dài của đèn LED cần nối với cực nào của pin để đèn sáng?',
    options: ['Nối với cực dương (+)', 'Nối với cực âm (-)', 'Cực nào cũng được', 'Không cần nối cực nào'],
    correctAnswer: 0,
    explanation: 'Đèn LED là điốt phát quang chỉ dẫn điện khi phân cực thuận: chân dài (dương) nối cực (+), chân ngắn (âm) nối cực (-).',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-04',
    topic: 'Điện học',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Mắc nối tiếp 2 viên pin 1,5V (cực âm pin 1 nối cực dương pin 2). Hiệu điện thế tổng cộng của bộ nguồn là:',
    options: ['1,5 V', '3,0 V', '0 V', '0,75 V'],
    correctAnswer: 1,
    explanation: 'Khi mắc nối tiếp hai nguồn điện, hiệu điện thế tổng bằng tổng hai hiệu điện thế: U = 1,5 + 1,5 = 3,0 V.',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-05',
    topic: 'Điện học',
    grade: 8,
    level: 'Vận dụng',
    question: 'Vôn kế được dùng để đo hiệu điện thế và phải được mắc vào mạch điện như thế nào?',
    options: ['Mắc nối tiếp với thiết bị cần đo', 'Mắc song song với thiết bị cần đo', 'Mắc trực tiếp vào công tắc', 'Mắc vào bất kì điểm nào'],
    correctAnswer: 1,
    explanation: 'Vôn kế có điện trở rất lớn nên phải mắc song song với đoạn mạch hoặc thiết bị cần đo hiệu điện thế.',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-06',
    topic: 'Điện học',
    grade: 8,
    level: 'Vận dụng',
    question: 'Nếu trong một đoạn mạch gồm 2 bóng đèn mắc nối tiếp, một bóng đèn bị cháy dây tóc thì bóng đèn còn lại sẽ:',
    options: ['Sáng mạnh hơn', 'Tắt hoàn toàn', 'Sáng bình thường', 'Bị nổ'],
    correctAnswer: 1,
    explanation: 'Vì đoạn mạch nối tiếp tạo thành một vòng khép kín duy nhất, khi một đèn đứt dây tóc mạch sẽ bị hở khiến dòng điện ngừng chạy qua toàn mạch.',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-07',
    topic: 'Điện học',
    grade: 8,
    level: 'Nhận biết',
    question: 'Vật liệu nào sau đây là chất dẫn điện tốt?',
    options: ['Nhựa cứng', 'Cao su', 'Đồng', 'Thủy tinh'],
    correctAnswer: 2,
    explanation: 'Đồng là kim loại có mật độ êlectron tự do cao, là chất dẫn điện rất tốt và thường dùng làm lõi dây điện.',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-08',
    topic: 'Điện học',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Quy tắc an toàn nào sau đây là BẮT BUỘC khi thực hành thí nghiệm điện trong trường học?',
    options: ['Chỉ thí nghiệm với nguồn pin điện áp thấp < 12V, không dùng điện lưới', 'Dùng tay ướt cắm phích điện', 'Nối tắt hai cực của pin với nhau', 'Không ngắt công tắc khi sửa chữa'],
    correctAnswer: 0,
    explanation: 'Học sinh chỉ được thao tác với pin điện áp thấp an toàn (<12V) và tuyệt đối không tiếp xúc nguồn điện lưới 220V.',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-09',
    topic: 'Điện học',
    grade: 8,
    level: 'Vận dụng cao',
    question: 'Một bóng đèn có ghi 3V - 0,3A. Điện trở của bóng đèn khi sáng bình thường là:',
    options: ['10 Ω', '0,9 Ω', '0,1 Ω', '9 Ω'],
    correctAnswer: 0,
    explanation: 'Theo định luật Ôm: R = U / I = 3V / 0,3A = 10 Ω.',
    relatedExperimentId: 'exp-simple-circuit'
  },
  {
    id: 'q-electric-10',
    topic: 'Điện học',
    grade: 8,
    level: 'Vận dụng cao',
    question: 'Một bóng đèn sợi đốt 220V - 100W và một đèn LED 220V - 12W cùng cho độ sáng tương đương. Đèn nào tiết kiệm điện hơn và tiết kiệm khoảng bao nhiêu lần?',
    options: ['Đèn LED tiết kiệm hơn khoảng 8 lần', 'Đèn sợi đốt tiết kiệm hơn', 'Hai đèn tiêu thụ điện như nhau', 'Đèn LED tiết kiệm hơn 2 lần'],
    correctAnswer: 0,
    explanation: 'Đèn LED chỉ tiêu thụ 12W trong khi đèn sợi đốt tiêu thụ 100W để phát ra quang thông tương đương (100 / 12 ≈ 8,3 lần).',
    relatedExperimentId: 'exp-simple-circuit'
  },

  // CHỦ ĐỀ 6: DAO ĐỘNG VÀ SÓNG ÂM (10 câu)
  {
    id: 'q-osc-01',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Nhận biết',
    question: 'Chu kì dao động T là:',
    options: ['Số dao động vật thực hiện trong 1 giây', 'Thời gian vật thực hiện được 1 dao động toàn phần', 'Quãng đường vật đi được trong 1 giây', 'Vận tốc lớn nhất của vật dao động'],
    correctAnswer: 1,
    explanation: 'Chu kì T là khoảng thời gian để vật thực hiện trọn vẹn 1 dao động toàn phần. Đơn vị là giây (s).',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-02',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Nhận biết',
    question: 'Tần số dao động f có đơn vị đo là gì?',
    options: ['Héc (Hz)', 'Giây (s)', 'Mét (m)', 'Đề-xi-ben (dB)'],
    correctAnswer: 0,
    explanation: 'Tần số f là số dao động thực hiện trong 1 giây, đơn vị là Héc (Hz). Mối quan hệ: f = 1 / T.',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-03',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Một con lắc thực hiện được 20 dao động trong thời gian 10 giây. Chu kì dao động T của con lắc là:',
    options: ['2 giây', '0,5 giây', '200 giây', '10 giây'],
    correctAnswer: 1,
    explanation: 'T = t / N = 10 s / 20 dao động = 0,5 giây.',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-04',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Khi tăng chiều dài sợi dây của con lắc đơn thì chu kì dao động của con lắc sẽ:',
    options: ['Tăng lên (dao động chậm lại)', 'Giảm đi (dao động nhanh hơn)', 'Không thay đổi', 'Bằng 0'],
    correctAnswer: 0,
    explanation: 'Chu kì của con lắc đơn tỉ lệ với căn bậc hai của chiều dài dây (T ~ √l). Dây càng dài thì chu kì T càng lớn, con lắc đung đưa chậm hơn.',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-05',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Vận dụng',
    question: 'Một lá thép dao động với tần số 50 Hz. Chu kì dao động của lá thép là:',
    options: ['0,02 giây', '50 giây', '2 giây', '0,5 giây'],
    correctAnswer: 0,
    explanation: 'T = 1 / f = 1 / 50 = 0,02 giây.',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-06',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Vận dụng',
    question: 'Muốn chu kì dao động của một con lắc đơn tăng lên gấp đôi (T\' = 2T), ta cần điều chỉnh chiều dài dây treo như thế nào?',
    options: ['Tăng chiều dài dây lên 2 lần', 'Tăng chiều dài dây lên 4 lần', 'Giảm chiều dài dây 2 lần', 'Tăng khối lượng quả nặng lên 4 lần'],
    correctAnswer: 1,
    explanation: 'Vì T ~ √l, để T tăng 2 lần thì l phải tăng lên 2^2 = 4 lần.',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-07',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Nhận biết',
    question: 'Tai người bình thường có thể nghe được âm thanh có tần số trong khoảng nào?',
    options: ['Dưới 16 Hz', 'Từ 16 Hz đến 20 000 Hz', 'Trên 20 000 Hz', 'Mọi tần số'],
    correctAnswer: 1,
    explanation: 'Dải tần số âm thanh mà tai người cảm thụ được là từ 16 Hz đến 20 000 Hz (hạ âm < 16 Hz, siêu âm > 20 000 Hz).',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-08',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Thông hiểu',
    question: 'Độ cao (bổng hay trầm) của âm thanh phụ thuộc vào đại lượng nào của dao động âm?',
    options: ['Biên độ dao động', 'Tần số dao động', 'Vận tốc truyền âm', 'Quãng đường truyền âm'],
    correctAnswer: 1,
    explanation: 'Âm phát ra càng bổng (cao) khi tần số dao động càng lớn, âm càng trầm khi tần số dao động càng nhỏ.',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-09',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Vận dụng cao',
    question: 'Một người đứng trước vách núi gõ một tiếng mạnh, sau 1,2 giây nghe thấy tiếng vọng lại. Cho vận tốc truyền âm trong không khí là 340 m/s. Khoảng cách từ người đó đến vách núi là:',
    options: ['408 m', '204 m', '170 m', '340 m'],
    correctAnswer: 1,
    explanation: 'Âm thanh đi tới vách núi và phản xạ trở lại người: 2d = v × t => d = (340 × 1,2) / 2 = 408 / 2 = 204 m.',
    relatedExperimentId: 'exp-pendulum-oscillation'
  },
  {
    id: 'q-osc-10',
    topic: 'Dao động và Sóng âm',
    grade: 8,
    level: 'Vận dụng cao',
    question: 'Khi thay quả nặng kim loại bằng một quả nặng bằng gỗ có cùng kích thước nhưng nhẹ hơn một nửa vào con lắc đơn, chu kì dao động nhỏ của con lắc sẽ:',
    options: ['Gần như không thay đổi', 'Tăng lên 2 lần', 'Giảm đi một nửa', 'Tăng lên căn 2 lần'],
    correctAnswer: 0,
    explanation: 'Chu kì dao động của con lắc đơn (với góc lệch nhỏ) không phụ thuộc vào khối lượng của quả nặng.',
    relatedExperimentId: 'exp-pendulum-oscillation'
  }
];

export const INITIAL_PRE_POST_ASSESSMENTS: PrePostAssessment[] = [
  {
    id: 'assessment-pre-test-grade7',
    title: 'Bài kiểm tra khảo sát kiến thức trước tác động (Pre-test KHTN 7)',
    type: 'pre_test',
    grade: 7,
    targetClassId: 'class-7a1',
    durationMinutes: 15,
    questions: [
      {
        id: 'pre-q1',
        question: 'Công thức tính tốc độ chuyển động là:',
        options: ['v = s / t', 'v = s × t', 'v = t / s', 'v = s - t'],
        correctAnswer: 0
      },
      {
        id: 'pre-q2',
        question: 'Đơn vị đo tốc độ chuẩn trong hệ SI là:',
        options: ['km/h', 'm/s', 'm/min', 'cm/s'],
        correctAnswer: 1
      },
      {
        id: 'pre-q3',
        question: 'Xe chạy 6 m trong 3 s có tốc độ là:',
        options: ['18 m/s', '2 m/s', '0.5 m/s', '3 m/s'],
        correctAnswer: 1
      },
      {
        id: 'pre-q4',
        question: 'Theo định luật phản xạ ánh sáng, nếu góc tới i = 40° thì góc phản xạ i\' bằng:',
        options: ['50°', '40°', '80°', '0°'],
        correctAnswer: 1
      },
      {
        id: 'pre-q5',
        question: 'Pháp tuyến của gương phẳng hợp với mặt phản xạ một góc:',
        options: ['0°', '45°', '90°', '180°'],
        correctAnswer: 2
      },
      {
        id: 'pre-q6',
        question: 'Ảnh tạo bởi gương phẳng có tính chất:',
        options: ['Ảnh thật hứng được trên màn', 'Ảnh ảo, lớn bằng vật', 'Ảnh thật nhỏ hơn vật', 'Ảnh ảo ngược chiều vật'],
        correctAnswer: 1
      },
      {
        id: 'pre-q7',
        question: 'Khoảng cách từ người đến gương là 2m thì khoảng cách từ người đến ảnh là:',
        options: ['2m', '4m', '1m', '3m'],
        correctAnswer: 1
      },
      {
        id: 'pre-q8',
        question: 'Khi đo tốc độ, thực hiện nhiều lần đo để làm gì?',
        options: ['Cho vui', 'Giảm sai số ngẫu nhiên', 'Tăng thời gian thực hành', 'Để xe chạy nhanh hơn'],
        correctAnswer: 1
      },
      {
        id: 'pre-q9',
        question: 'Tia sáng tới vuông góc mặt gương (i = 0°) thì góc phản xạ bằng:',
        options: ['90°', '0°', '45°', '180°'],
        correctAnswer: 1
      },
      {
        id: 'pre-q10',
        question: 'Tốc độ 10 m/s tương ứng với bao nhiêu km/h?',
        options: ['36 km/h', '10 km/h', '3.6 km/h', '100 km/h'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'assessment-post-test-grade7',
    title: 'Bài kiểm tra đánh giá kiến thức sau tác động (Post-test KHTN 7)',
    type: 'post_test',
    grade: 7,
    targetClassId: 'class-7a1',
    durationMinutes: 15,
    questions: [
      {
        id: 'post-q1',
        question: 'Để xác định quãng đường s khi biết tốc độ v và thời gian t, ta dùng:',
        options: ['s = v × t', 's = v / t', 's = t / v', 's = v + t'],
        correctAnswer: 0
      },
      {
        id: 'post-q2',
        question: 'Đơn vị km/h thường dùng trong thực tế, còn đơn vị chuẩn SI là:',
        options: ['m/s', 'm/min', 'cm/s', 'km/s'],
        correctAnswer: 0
      },
      {
        id: 'post-q3',
        question: 'Một học sinh bơi 50m hết 25 giây, tốc độ trung bình của bạn là:',
        options: ['2 m/s', '0.5 m/s', '1250 m/s', '25 m/s'],
        correctAnswer: 0
      },
      {
        id: 'post-q4',
        question: 'Chiếu tia sáng tới gương với góc tới i = 55°, góc phản xạ i\' là:',
        options: ['35°', '55°', '110°', '90°'],
        correctAnswer: 1
      },
      {
        id: 'post-q5',
        question: 'Đường thẳng vuông góc với mặt gương tại điểm tới gọi là:',
        options: ['Tia tới', 'Tia phản xạ', 'Pháp tuyến', 'Mặt phẳng tới'],
        correctAnswer: 2
      },
      {
        id: 'post-q6',
        question: 'Vật cách gương phẳng 80 cm thì ảnh của vật cách gương phẳng một khoảng:',
        options: ['40 cm', '80 cm', '160 cm', '0 cm'],
        correctAnswer: 1
      },
      {
        id: 'post-q7',
        question: 'Góc tạo bởi tia tới và tia phản xạ khi góc tới i = 30° là:',
        options: ['30°', '60°', '90°', '15°'],
        correctAnswer: 1
      },
      {
        id: 'post-q8',
        question: 'Khi đo thời gian xe chạy 3 lần: 4.1s, 4.0s, 3.9s, thời gian trung bình là:',
        options: ['4.0 s', '4.1 s', '3.9 s', '12.0 s'],
        correctAnswer: 0
      },
      {
        id: 'post-q9',
        question: 'Muốn tia phản xạ vuông góc với tia tới thì góc tới i phải bằng:',
        options: ['45°', '90°', '30°', '60°'],
        correctAnswer: 0
      },
      {
        id: 'post-q10',
        question: 'Một ô tô chạy với tốc độ 72 km/h tương đương với bao nhiêu m/s?',
        options: ['20 m/s', '72 m/s', '200 m/s', '2 m/s'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'assessment-interest-survey',
    title: 'Khảo sát hứng thú học tập và thái độ khoa học (5 mức độ)',
    type: 'interest_survey',
    grade: 7,
    targetClassId: 'class-7a1',
    durationMinutes: 10,
    questions: [
      {
        id: 'survey-q1',
        question: 'Em cảm thấy môn Vật lí (KHTN) trở nên trực quan, dễ hiểu hơn khi được thực hành thí nghiệm và thu thập số liệu thật.',
        options: ['Rất không đồng ý', 'Không đồng ý', 'Bình thường', 'Đồng ý', 'Rất đồng ý'],
        category: 'Hứng thú bộ môn'
      },
      {
        id: 'survey-q2',
        question: 'Trợ lý AI Physi giúp em giải thích các hiện tượng khoa học và đặt câu hỏi gợi mở mà không làm mất đi tư duy tự lập.',
        options: ['Rất không đồng ý', 'Không đồng ý', 'Bình thường', 'Đồng ý', 'Rất đồng ý'],
        category: 'Hỗ trợ của AI'
      },
      {
        id: 'survey-q3',
        question: 'Việc tự nhập số liệu, vẽ biểu đồ và so sánh các lần đo giúp em hiểu sâu bản chất các định luật Vật lí.',
        options: ['Rất không đồng ý', 'Không đồng ý', 'Bình thường', 'Đồng ý', 'Rất đồng ý'],
        category: 'Năng lực thực chứng'
      },
      {
        id: 'survey-q4',
        question: 'Các trò chơi đấu trường Vật lí tạo cho em niềm vui và động lực thi đua học tập cùng các bạn.',
        options: ['Rất không đồng ý', 'Không đồng ý', 'Bình thường', 'Đồng ý', 'Rất đồng ý'],
        category: 'Động lực học tập'
      },
      {
        id: 'survey-q5',
        question: 'Em mong muốn tiếp tục được sử dụng nền tảng Vật lí Thực chứng AI trong các năm học tiếp theo.',
        options: ['Rất không đồng ý', 'Không đồng ý', 'Bình thường', 'Đồng ý', 'Rất đồng ý'],
        category: 'Khả năng nhân rộng'
      }
    ]
  }
];

export const INITIAL_STEM_PROJECTS: StemProject[] = [
  {
    id: 'stem-balloon-car',
    title: 'Thử thách 1: Chế tạo xe phản lực bằng vật liệu tái chế',
    grade: 7,
    description: 'Vận dụng định luật phản lực và kiến thức về tốc độ chuyển động để thiết kế một mô hình xe bốn bánh chạy bằng lực đẩy của quả bóng bay, di chuyển được quãng đường xa nhất và thẳng nhất.',
    materials: [
      'Bìa các tông hoặc nắp chai nhựa làm thân và bánh xe',
      'Ống hút nhựa hoặc que tre làm trục quay bánh xe',
      'Bóng bay cỡ trung bình',
      'Băng dính, kéo, súng bắn keo nến an toàn'
    ],
    challengeGoal: 'Xe tự chế phải di chuyển được quãng đường tối thiểu 3.0 m trên mặt sàn phẳng và đo được tốc độ trung bình của xe.',
    criteria: [
      { criterion: 'Tính khoa học (chuyển động thẳng, giảm ma sát bánh xe)', points: 25 },
      { criterion: 'Tính sáng tạo và sử dụng vật liệu tái chế', points: 25 },
      { criterion: 'Chất lượng thử nghiệm và bảng số liệu đo quãng đường/thời gian', points: 25 },
      { criterion: 'Khả năng giải thích hiện tượng và đề xuất cải tiến khí động học', points: 25 }
    ]
  },
  {
    id: 'stem-periscope',
    title: 'Thử thách 2: Thiết kế kính tiềm vọng quang học',
    grade: 7,
    description: 'Vận dụng định luật phản xạ ánh sáng trên gương phẳng với góc tới 45° để chế tạo một chiếc kính tiềm vọng cho phép người quan sát nhìn thấy vật thể ở phía trên bờ tường hoặc qua chướng ngại vật.',
    materials: [
      'Hộp sữa giấy dài hoặc hộp bìa các-tông hình hộp chữ nhật',
      '2 tấm gương phẳng nhỏ kích thước khoảng 5cm x 5cm',
      'Thước đo góc, kéo, keo dán'
    ],
    challengeGoal: 'Hai gương phải được đặt nghiêng chính xác 45° so với phương thẳng đứng và song song với nhau; hình ảnh nhìn qua kính phải sắc nét, không bị méo lệch.',
    criteria: [
      { criterion: 'Căn chỉnh góc 45° chuẩn xác theo định luật phản xạ', points: 30 },
      { criterion: 'Độ sắc nét của ảnh quan sát qua chướng ngại vật', points: 30 },
      { criterion: 'Độ chắc chắn, thẩm mỹ và gọn nhẹ của mô hình', points: 20 },
      { criterion: 'Bản vẽ thiết kế mô phỏng đường đi của tia sáng', points: 20 }
    ]
  },
  {
    id: 'stem-smart-flashlight',
    title: 'Thử thách 3: Chế tạo đèn pin khẩn cấp an toàn',
    grade: 8,
    description: 'Lắp ráp mô hình đèn pin cầm tay sử dụng nguồn pin 3V, công tắc gạt tự chế và bóng LED siêu sáng với chụp phản xạ tăng cường độ rọi.',
    materials: [
      '2 viên pin AA kèm khay đựng pin',
      'Bóng đèn LED siêu sáng kèm điện trở bảo vệ',
      'Kẹp giấy hoặc lá đồng làm công tắc cơ học',
      'Cốc giấy hoặc vỏ chai nhựa làm chóa đèn phản xạ'
    ],
    challengeGoal: 'Mạch điện kín hoạt động tin cậy, đóng mở dứt khoát, đèn chiếu xa tối thiểu 2 mét trong phòng tối.',
    criteria: [
      { criterion: 'Mạch điện an toàn, mối nối chắc chắn, có điện trở bảo vệ', points: 30 },
      { criterion: 'Công tắc cơ học tự chế đóng ngắt mượt mà', points: 25 },
      { criterion: 'Hiệu quả chóa phản xạ gom chùm sáng', points: 25 },
      { criterion: 'Thuyết minh nguyên lí hoạt động của mạch điện', points: 20 }
    ]
  }
];
