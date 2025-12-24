const supabaseUrl = 'https://rvntujioqkontqqjhxdb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bnR1amlvcWtvbnRxcWpoeGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjkwNTMsImV4cCI6MjA3NTUwNTA1M30.YGPpQFss05qu3YmmHvnmfJycmhbQDTSKlzDz25Gbg6c';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);




    

new Vue({
    el: '#app',
    data: {
        files: [],
        bucket: 'aipri',
        older: 'main', 
        files: [],
        lovefiles: [],
        allph: [],
        allph9: [],
        loading: false,
        error: '',
        charaName: 'HINA',
        myqr: '',
        profile: '',
        season: "甜點季度",
        level: 4,
        call: "鑽石甜點",
        record: [],
        collection: [],
        catalog: "第一彈",
        catalist: [],
        colorMap: {
          "陽葵": "#e44d97",
          "美月": "#40bedf",
          "櫻":"#e64064"
        },
        upload_title: "",
        upload_star: null,
        upload_play: null,
        upload_time: "",
        upload_place: "",
        upload_description: "",
        monthList: [],
        month_rec: "2025-12"
    },
    
    async mounted() {
        this.generateMonths()
        this.fetchFiles()
        this.mainCo()
        this.mainPro()
        this.love()
        this.allp()
        try {

          
          
          const { data, error } = await supabaseClient
            .from('apr')
            .select('*')
            .order('id', { ascending: true })
        
          if (error) throw error
        
          this.collection = data || []
          this.catalist = [...new Set(this.collection.map(item => item.catalog))] || []


          
        
        } catch (err) {
          console.error('Supabase select failed:', err)
        }
        try {

        
          
          const { data, error } = await supabaseClient
            .from('apr_rec')
            .select('*')
            .order('time', { ascending: false })
            .order('id', { ascending: false })
        
          if (error) throw error
        
          this.record = data || []
       


          
        
        } catch (err) {
          console.error('Supabase select failed:', err)
        }
        
    },
    methods: {
        async fetchFiles () {
            this.loading = true
            this.error = ''
            this.files = []
  
            const folderPath = this.folder || '' // 根目錄就用空字串
  
            // 1️⃣ 用 supabaseClient，而不是 client
            const { data, error } = await supabaseClient
              .storage
              .from(this.bucket)
              .list(folderPath, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' }
              })
  
            if (error) {
              console.error('讀取失敗：', error)
              this.error = '讀取失敗：' + error.message
              this.loading = false
              return
            }
  
            // 2️⃣ 把每個檔案轉成 publicUrl
            this.files = data.map(file => {
              const path = (folderPath ? folderPath + '/' : '') + file.name
  
              const { data: urlData } = supabaseClient
                .storage
                .from(this.bucket)
                .getPublicUrl(path)
  
              return {
                name: file.name,
                path,
                url: urlData.publicUrl
              }
            })
  
            this.loading = false
        },
        async mainCo(){
            this.loading = true
            this.error = ''
            this.files = []
  
            const folderPath = this.folder || '' // 根目錄就用空字串
  
            // 1️⃣ 用 supabaseClient，而不是 client
            const { data, error } = await supabaseClient
              .storage
              .from(this.bucket)
              .getPublicUrl('main/MyQR.jpg')
  
            if (error) {
              console.error('讀取失敗：', error)
              this.error = '讀取失敗：' + error.message
              this.loading = false
              return
            }
            
            this.myqr = data.publicUrl
            console.log(data.publicUrl)
            
        },
        async mainPro(){
            this.loading = true
            this.error = ''
            this.files = []
  
            const folderPath = this.folder || '' // 根目錄就用空字串
  
            // 1️⃣ 用 supabaseClient，而不是 client
            const { data, error } = await supabaseClient
              .storage
              .from(this.bucket)
              .getPublicUrl('profile/1.jpg')
  
            if (error) {
              console.error('讀取失敗：', error)
              this.error = '讀取失敗：' + error.message
              this.loading = false
              return
            }
            
            this.profile = data.publicUrl
            console.log(data.publicUrl)
            
        },
        async love () {
          this.loading = true
          this.error = ''
          this.lovefiles = []

          const folderPath = 'love'

          // 1️⃣ 用 supabaseClient，而不是 client
          const { data, error } = await supabaseClient
            .storage
            .from(this.bucket)
            .list(folderPath, {
              limit: 3,
              offset: 0,
              sortBy: { column: 'created_at', order: 'desc' }
            })

          if (error) {
            console.error('讀取失敗：', error)
            this.error = '讀取失敗：' + error.message
            this.loading = false
            return
          }

          // 2️⃣ 把每個檔案轉成 publicUrl
          this.lovefiles = data.map(file => {
            const path = (folderPath ? folderPath + '/' : '') + file.name

            const { data: urlData } = supabaseClient
              .storage
              .from(this.bucket)
              .getPublicUrl(path)

            return {
              name: file.name,
              path,
              url: urlData.publicUrl,
              addedOn: file.created_at ? new Date(file.created_at).toLocaleDateString('zh-TW'): '未知'
            }
          })

          this.loading = false
        },
        async allp () {
          this.loading = true
          this.error = ''
          this.allph = []

          const folderPath = 'allPhoto'

          // 1️⃣ 用 supabaseClient，而不是 client
          const { data, error } = await supabaseClient
            .storage
            .from(this.bucket)
            .list(folderPath, {
              offset: 0,
              sortBy: { column: 'created_at', order: 'desc' }
            })

          if (error) {
            console.error('讀取失敗：', error)
            this.error = '讀取失敗：' + error.message
            this.loading = false
            return
          }

          // 2️⃣ 把每個檔案轉成 publicUrl
          this.allph = data.map(file => {
            const path = (folderPath ? folderPath + '/' : '') + file.name

            const { data: urlData } = supabaseClient
              .storage
              .from(this.bucket)
              .getPublicUrl(path)

            return {
              name: file.name,
              path,
              url: urlData.publicUrl,
              addedOn: file.created_at ? new Date(file.created_at).toLocaleDateString('zh-TW'): '未知'
            }
          })
          this.allph9 = this.allph.slice(0, 9);
          this.loading = false
        },
        go(url) {
          window.location.href = url;
        },
        async plus(id,num){

          const newNum = num + 1;
          
          
          const { error: updateError } = await supabaseClient
          .from('apr')
          .update({ num: newNum})
          .eq('id', id);

          if (updateError) {
            alert("更新失敗：" + updateError.message);
            console.error(updateError);
            return;
          }

          const item = this.collection.find(f => f.id === id);
          if (item) {
            item.num = newNum;
          }
        
          
  
         
          
  
        },
        async minus(id,num){

          if (num <= 0){
            alert("不得小於0");
          }else{
            const newNum = num - 1;
          
          
            const { error: updateError } = await supabaseClient
            .from('apr')
            .update({ num: newNum})
            .eq('id', id);

            if (updateError) {
              alert("更新失敗：" + updateError.message);
              console.error(updateError);
              return;
            }

            const item = this.collection.find(f => f.id === id);
            if (item) {
              item.num = newNum;
            }
          }
       
  
         
          
  
        },
        async insert(){

          if (
            !this.upload_title.trim() ||
            !this.upload_description.trim() ||
            !this.upload_time.trim() ||
            !this.upload_place.trim()
          ) {
            alert("請輸入所有欄位內容。");
            return;
          }
  
          const star = Number(this.upload_star);
  
          if (isNaN(star) || star <= 0 || star > 10) {
            alert("請輸入正確數量。");
            return;
          }

          const play = Number(this.upload_play);
  
          if (isNaN(play) || play <= 0 || play > 5) {
            alert("請輸入正確數量。");
            return;
          }

          const { data, error } = await supabaseClient
          .from('apr_rec')
          .insert([
            {
              title: this.upload_title,
              star: this.upload_star,
              place: this.upload_place,
              time: this.upload_time,
              description: this.upload_description,
              play: this.upload_play
            }
          ])

          if (error) {
            console.error("Insert failed:", error)
          } else {
            console.log("Insert success:", data)
            alert("上傳成功！");
            window.location.reload();
          }
        },
        generateMonths() {
          const result = []
    
          // 取得現在時間
          const now = new Date()
          const currentYear = now.getFullYear()
          const currentMonth = now.getMonth() + 1 // 月份從 0 開始，因此 +1
    
          // 生成起始月份（當年的 11 月）
          let startYear = currentYear
          let startMonth = 11
    
          // 若現在月份 < 11，表示應該從「去年 11 月」開始
          if (currentMonth < 11) {
            startYear = currentYear - 1
          }
    
          // 從 startYear-11月 開始一路加到現在
          let y = startYear
          let m = 11
    
          while (y < currentYear || (y === currentYear && m <= currentMonth)) {
            const formatted = `${y}-${String(m).padStart(2, "0")}`
            result.push(formatted)
    
            // 加一個月
            m++
            if (m > 12) {
              m = 1
              y++
            }
          }
    
          this.monthList = result
        },
        async fetchByMonth() {
          if (!this.month_rec) return
        
          const [yStr, mStr] = this.month_rec.split('-')   // "2025", "12"
          const y = Number(yStr)
          const m = Number(mStr)
        
          const startDate = `${yStr}-${mStr}-01`          // "2025-12-01"
        
          // 算「下一個月」的 1 號
          const next = new Date(y, m) // JS 的月是 0-based，所以 (y, m) 就是下個月
          const nextY = next.getFullYear()
          const nextM = String(next.getMonth() + 1).padStart(2, '0')
          const endDate = `${nextY}-${nextM}-01`          // 比如 "2026-01-01"
        
          const { data, error } = await supabaseClient
            .from('apr_rec')
            .select('*')
            .gte('time', startDate)   // >= 本月 1 號
            .lt('time', endDate)      // < 下個月 1 號
            .order('time', { ascending: false })
            .order('id', { ascending: false })
        
          if (error) {
            console.error(error)
            return
          }
        
          this.record = data || []
        
          console.log('month_rec:', this.month_rec)
          console.log('startDate:', startDate)
          console.log('endDate:', endDate)
          console.log('result:', this.record)
        },
        async deleteRow(id) {
          const { data, error } = await supabaseClient
            .from('apr_rec')
            .delete()
            .eq('id', id)
      
          if (error) {
            console.error("Delete failed:", error)
            alert("刪除失敗")
            return
          }
      
          alert("刪除成功")
          window.location.reload();
        },
        async editRow(id) {
          const { data, error } = await supabaseClient
            .from('apr_rec')
            .update({edit: true})
            .eq('id', id)
      
          if (error) {
            console.error("Delete failed:", error)
            alert("刪除失敗")
            return
          }
      
          
        }
        
        
        
        
        
    },
    computed: {
      
    }
    })