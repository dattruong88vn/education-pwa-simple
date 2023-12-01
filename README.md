# 1. Tạo File manifest.json ở root

        - Name: tên hiển thị trên icon
        - start_url: url được open khi click vào icon
        - display:
                + browser: mở trong browser
                + standalone: mở như một native appp
        - background_color:
        - theme_color: giá trị HEX, màu của thanh bar nhỏ khi mở PWA
        - icons: icon hiển thị trên điện thoại

# 2. Thêm thẻ link trong file html đến file manifest:

        <link rel="manifest" href="/manifest.json">

# 3.Browser hiển thị thông tin của manifest trong tab Application

# 4. Đối với iOS cần config thêm trong header của file html:

        <link rel="apple-touch-icon" href="/img/icons/icon-96x96.png">
        <meta name="apple-mobile-web-app-status-bar" content="#FFE1C4">

# 5. Service Workers

        - Thông thường trong 1 project, các file JS được thực thi trên main thread và tương tác với DOM
        - File Service Workers chạy trên một thread độc lập khác với các file JS ở trên. và nó không tương tác với DOM.
        - Chạy ngầm ngay cả khi app đã được close.
        - Lắng nghe các event như request, push message, tải css ...
        - SW chỉ chạy trên HTTPS connection.

# 6. Service Worker Life Cycle:

        Gồm có 3 phrase:

        - Register SW
                + Check browser có support SW
                + Config scope của SW control: thông thường chính là location của file sw, nhưng cũng có thể chỉ định thư mục cụ thể

        - Install SW
                + Sau khi Register thành công thì không có nghĩa SW đã được cài đặt.
                + SW chỉ được cài đặt nếu thoả 1 trong 2 điều kiện sau:
                        * SW chưa được register trước đó
                        * SW script có thay đổi (1 byte cũng là thay đổi)
                + Khi SW được install, nó sẽ fire event "install", chúng ta có thể lắng nghe event này để thực hiện các task mong muốn.

        - Activation SW
                + Sau khi install thành công, SW sẽ chuyển trạng thái thành Installed, chưa phải là Active.
                + Lúc này phải đợi để control page với SW hiện tại. Sau đó sẽ chuyển sang phrase tiếp theo là Activation
                + SW sẽ không active ngay sau khi install thành công. Nó chỉ được active khi thoả một trong các điều kiện sau:
                        * Không có SW nào đang được active.
                        * Nếu method self.skipWaiting() được call trong "install" event handler ở phase Install
                        * Nếu user refresh page: thêm config update on reload trong Browser Devtool --> Application

# 7. Fetch Events

        - Khi browser gửi request lên server, thông thường sẽ nhận lại response và hiển thị lên UI.
        - SW đứng ở giữa Browser và Server và lắng nghe những events này, đồng thời cache lại data được gửi từ server về browser.
        - SW có quyền stop request gửi lên server của browser hoặc thay đổi response trả về.
        - Khi PWA hoạt động offline, browser gửi request lên server sẽ bị SW chặn lại và trả về data cache trước đó.

# 8. Cache

        - Thực hiện khi register SW, cụ thể là trong fn handler event install.
        - Sử dụng method open của global object caches, return về promise
                + caches.open("staticCacheName")
                + Resolve function có tham số là cache. Sử dụng method cache.add(string) hoặc cache.addAll([string]) để thêm các request lên server: như request load html, css, js, font, image....
                + Ví dụ:
                        cache.addAll(["/", "/index.html", "/css/global.css"])

        - Để đảm bảo toàn bộ quá trình cache hoàn thành khi SW install, sau đó mới tiến hành activate. Sử dụng method waitUntil của tham số event (tham số fn handler). Pass toàn bộ method caches.open như đối số của method waitUntil.
                + Ví dụ: event.waitUntil(caches.open("staticCacheName").then(cache => {
                        cache.addAll(["/", "/index.html","/css/global.css"])
                }))

# education-pwa-simple
